import React, { useState } from 'react';
import { AppView, Persona } from './types';
import PersonaSelector from './components/PersonaSelector';
import ChatInterface from './components/ChatInterface';
import ResearchAssistant from './components/ResearchAssistant';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SELECTION);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isResearchOpen, setIsResearchOpen] = useState(false); // Mobile toggle default closed
  const [desktopResearchOpen, setDesktopResearchOpen] = useState(true); // Desktop default open

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setView(AppView.CHAT);
  };

  const handleEndSession = () => {
    setSelectedPersona(null);
    setView(AppView.SELECTION);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top Navbar */}
      {view === AppView.SELECTION && (
        <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              PitchPerfect AI
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Master your fundraising pitch with realistic AI simulations
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        
        {view === AppView.SELECTION ? (
          <div className="w-full h-full overflow-y-auto bg-slate-50">
            <PersonaSelector onSelect={handleSelectPersona} />
          </div>
        ) : (
          /* Chat Layout */
          <>
            {/* Main Chat Area */}
            <div className={`flex-1 h-full transition-all duration-300 relative z-0 ${desktopResearchOpen ? 'mr-0 lg:mr-[350px]' : ''}`}>
              {selectedPersona && (
                <ChatInterface 
                  persona={selectedPersona} 
                  onEndSession={handleEndSession}
                  onToggleResearch={() => setIsResearchOpen(!isResearchOpen)}
                />
              )}
              
              {/* Desktop Toggle for Research Panel */}
              <button 
                onClick={() => setDesktopResearchOpen(!desktopResearchOpen)}
                className={`hidden lg:flex absolute top-1/2 -right-3 w-6 h-12 bg-white border border-slate-200 rounded-l-lg items-center justify-center shadow-md z-20 hover:text-indigo-600 transition-all ${desktopResearchOpen ? 'translate-x-0' : 'translate-x-0'}`}
                style={{ right: desktopResearchOpen ? '0' : '0' }}
                title={desktopResearchOpen ? "Close Research" : "Open Research"}
              >
                <div className="w-1 h-4 bg-slate-300 rounded-full" />
              </button>
            </div>

            {/* Research Sidebar - Desktop */}
            <div className={`hidden lg:block fixed right-0 top-0 bottom-0 w-[350px] bg-white shadow-2xl transition-transform duration-300 z-10 ${desktopResearchOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <ResearchAssistant />
            </div>

            {/* Research Sidebar - Mobile/Tablet Overlay */}
            {isResearchOpen && (
              <div className="lg:hidden absolute inset-0 z-30 flex justify-end">
                <div 
                   className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                   onClick={() => setIsResearchOpen(false)}
                />
                <div className="w-[85%] max-w-[350px] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                  <ResearchAssistant />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;