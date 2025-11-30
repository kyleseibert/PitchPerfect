import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, StopCircle, RefreshCw, ArrowLeft, Menu } from 'lucide-react';
import { Message, Persona } from '../types';
import { createDonorChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  persona: Persona;
  onEndSession: () => void;
  onToggleResearch: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ persona, onEndSession, onToggleResearch }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat with dynamic greeting
  useEffect(() => {
    const initChat = async () => {
      setMessages([]);
      setIsTyping(true);
      
      chatInstance.current = createDonorChat(persona);

      try {
        // Trigger the AI to generate the opening line based on its persona
        const response = await chatInstance.current.sendMessage({
          message: `[SYSTEM: The simulation is starting. You are ${persona.name}. The fundraiser has just arrived. Greet them authentically in character to start the conversation.]`
        });
        
        const greeting = response.text;
        
        if (greeting) {
          setMessages([{
            id: 'init-' + Date.now(),
            role: 'model',
            text: greeting,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error("Failed to generate opening greeting:", error);
        // Fallback greeting if API fails
        setMessages([{
          id: 'init-fallback',
          role: 'model',
          text: `*Nods* Hello. I'm ${persona.name}. Please, go ahead.`,
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
      }
    };

    initChat();
  }, [persona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || !chatInstance.current || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const resultStream = await chatInstance.current.sendMessageStream({ message: userMsg.text });
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true
      }]);

      let fullText = '';
      
      for await (const chunk of resultStream) {
         const c = chunk as GenerateContentResponse;
         const text = c.text;
         if (text) {
           fullText += text;
           setMessages(prev => prev.map(msg => 
             msg.id === botMsgId ? { ...msg, text: fullText } : msg
           ));
         }
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "*[Connection interrupted. Please try saying that again.]*",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 relative">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onEndSession} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="End Session">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="relative">
                <img src={persona.avatar} alt={persona.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div>
               <h2 className="font-bold text-slate-800 text-sm md:text-base">{persona.name}</h2>
               <p className="text-xs text-slate-500">{persona.role}</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={onToggleResearch}
             className="md:hidden p-2 text-indigo-600 bg-indigo-50 rounded-lg"
           >
             <Menu size={20}/>
           </button>
           <button 
             onClick={onEndSession}
             className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
           >
             <StopCircle size={14} /> End Session
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
              ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm text-sm md:text-base leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
              <ReactMarkdown 
                className="markdown-content"
                components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <span className="font-bold opacity-90" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center">
               <Bot size={16} />
             </div>
             <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your pitch or response..."
            disabled={isTyping}
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI roleplay can be unpredictable. Verify important facts with the Research Assistant.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;