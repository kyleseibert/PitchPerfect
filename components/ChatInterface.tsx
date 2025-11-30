import React, { useState, useEffect, useRef } from 'react';
import { Persona, Message } from '../types';
import { createDonorChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";
import { Send, ArrowLeft, MoreHorizontal, BookOpen, RotateCcw } from 'lucide-react';

interface ChatInterfaceProps {
  persona: Persona;
  onEndSession: () => void;
  onToggleResearch: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ persona, onEndSession, onToggleResearch }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat
    chatSessionRef.current = createDonorChat(persona);
    setMessages([
        {
            id: 'init-1',
            role: 'model',
            text: `*${persona.name} enters the room looking ${persona.difficulty === 'Easy' ? 'welcoming' : persona.difficulty === 'Medium' ? 'attentive' : 'impatient'}.* \n\n"Hello. I understand you have a proposal for me? Go ahead, I'm listening."`,
            timestamp: new Date()
        }
    ]);
  }, [persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userText });
      
      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true
      }]);

      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMessageId 
              ? { ...msg, text: fullText } 
              : msg
          ));
        }
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "*[System]: The donor seems distracted (Connection Error). Please try saying that again.*",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onEndSession} 
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="End Session"
          >
            <ArrowLeft size={20} />
          </button>
          
          <img 
            src={persona.avatar} 
            alt={persona.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
          />
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">{persona.name}</h2>
            <p className="text-xs text-slate-500">{persona.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {/* Research toggle for Mobile */}
           <button 
            onClick={onToggleResearch}
            className="lg:hidden p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
            title="Open Research"
          >
            <BookOpen size={20} />
          </button>
          
          <button 
             onClick={() => {
                 if(confirm("Restart conversation?")) {
                     chatSessionRef.current = createDonorChat(persona);
                     setMessages([{
                        id: Date.now().toString(),
                        role: 'model',
                        text: `*${persona.name} resets.* \n\n"Let's start over. What did you want to discuss?"`,
                        timestamp: new Date()
                     }]);
                 }
             }}
             className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
             title="Restart Chat"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               {/* Avatar for Model */}
               {msg.role === 'model' && (
                 <img 
                   src={persona.avatar} 
                   alt={persona.name} 
                   className="w-8 h-8 rounded-full object-cover border border-slate-200 mt-1 shrink-0"
                 />
               )}

               <div className={`
                 p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                 ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
               `}>
                 {msg.text}
                 {msg.isStreaming && <span className="inline-block w-1.5 h-3 ml-1 bg-indigo-400 animate-pulse"/>}
               </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Pitch to ${persona.name.split(' ')[0]}...`}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-60"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
                !inputValue.trim() || isLoading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            {isLoading ? <MoreHorizontal className="animate-pulse" size={20} /> : <Send size={20} />}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-2">
          AI can make mistakes. Treat this as a practice simulation.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;