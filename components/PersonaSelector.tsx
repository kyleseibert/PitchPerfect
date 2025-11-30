import React, { useState, useEffect } from 'react';
import { Persona } from '../types';
import { Briefcase, TrendingUp, Heart, Building2, GraduationCap, Zap, Coffee, Plus, X, Save, Trash2, UserPlus } from 'lucide-react';

interface PersonaSelectorProps {
  onSelect: (persona: Persona) => void;
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: '1',
    name: "Eleanor Vance",
    role: "Philanthropic Foundation Director",
    difficulty: "Medium",
    description: "Professional, data-driven, and focused on impact metrics. She cares about long-term sustainability and clear outcomes.",
    systemInstruction: "You are Eleanor Vance. You run a large family foundation. You are polite but very focused on 'ROI' (Return on Impact). You ask specific questions about overhead, logic models, and scalability.",
    avatar: "https://picsum.photos/seed/eleanor/100/100"
  },
  {
    id: '2',
    name: "Marcus Thorne",
    role: "Tech Billionaire",
    difficulty: "Hard",
    description: "Impatient, innovative, and skeptical of traditional non-profit models. He wants 'disruption' and 'moonshots'.",
    systemInstruction: "You are Marcus Thorne, a self-made tech billionaire. You hate buzzwords unless they are tech buzzwords. You are bored easily. You challenge the user to think bigger. You might interrupt or be blunt.",
    avatar: "https://picsum.photos/seed/marcus/100/100"
  },
  {
    id: '3',
    name: "Sarah Jenkins",
    role: "Local Community Leader",
    difficulty: "Easy",
    description: "Warm, community-focused, and emotional. She cares about stories of individuals and local impact.",
    systemInstruction: "You are Sarah Jenkins, a beloved local business owner and community organizer. You make decisions with your heart. You want to hear moving stories about real people. You are very supportive but have limited funds.",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    id: '4',
    name: "Julian Castillo",
    role: "Corporate CSR Lead",
    difficulty: "Easy",
    description: "Friendly but transactional. Focuses on brand visibility, PR opportunities, and employee volunteer engagement.",
    systemInstruction: "You are Julian Castillo, CSR Lead for a major corporation. You are very friendly and corporate. You use words like 'synergy', 'deliverables', and 'brand lift'. You want to know exactly what the marketing benefits are for your company to partner with them.",
    avatar: "https://picsum.photos/seed/julian/100/100"
  },
  {
    id: '5',
    name: "Dr. Alana Sato",
    role: "Academic Grant Reviewer",
    difficulty: "Hard",
    description: "Rigorous and skeptical. Demands evidence-based impact data, citations, and clear logic models.",
    systemInstruction: "You are Dr. Alana Sato, a program officer with a PhD in Sociology. You are critical and precise. You dislike anecdotal evidence. You interrupt to ask for data sources, methodology, and long-term impact studies. You are not swayed by emotion, only by proven facts.",
    avatar: "https://picsum.photos/seed/alana/100/100"
  },
  {
    id: '6',
    name: "Teddy O'Malley",
    role: "Venture Philanthropist",
    difficulty: "Hard",
    description: "Aggressive and fast-paced. Treats donations like seed investments and asks about scaling and exit strategies.",
    systemInstruction: "You are Teddy O'Malley, a tech investor turned philanthropist. You speak fast and use startup jargon (burn rate, runway, scaling). You are impatient. You want to back a 'unicorn' non-profit. You challenge the user to think bigger and faster. You treat the donation like a Series A investment.",
    avatar: "https://picsum.photos/seed/teddy/100/100"
  },
  {
    id: '7',
    name: "Grandma Rose",
    role: "Legacy Donor",
    difficulty: "Easy",
    description: "Sweet, patient, and loyal. She wants to feel a personal connection and cares deeply about the mission's heart.",
    systemInstruction: "You are Grandma Rose, a retired teacher. You are very kind and chatty. You care about the people. If the user uses business jargon, you get confused and ask them to explain it simply. You want to hear a touching story about who the money helps.",
    avatar: "https://picsum.photos/seed/rose/100/100"
  }
];

const getRoleIcon = (role: string) => {
  if (role.includes('Tech') || role.includes('Venture')) return <TrendingUp size={14} />;
  if (role.includes('Community') || role.includes('Donor')) return <Heart size={14} />;
  if (role.includes('Foundation') || role.includes('CSR')) return <Building2 size={14} />;
  if (role.includes('Academic')) return <GraduationCap size={14} />;
  if (role.includes('Legacy')) return <Coffee size={14} />;
  return <Briefcase size={14} />;
};

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    difficulty: 'Medium',
    name: '',
    role: '',
    description: '',
    systemInstruction: ''
  });

  // Load custom personas from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pitchPerfect_custom_personas');
    if (saved) {
      try {
        setCustomPersonas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse custom personas", e);
      }
    }
  }, []);

  const handleSaveCustomPersona = () => {
    if (!newPersona.name || !newPersona.role || !newPersona.description || !newPersona.systemInstruction) {
      alert("Please fill in all fields.");
      return;
    }

    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name,
      role: newPersona.role,
      difficulty: (newPersona.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
      description: newPersona.description,
      systemInstruction: newPersona.systemInstruction,
      avatar: `https://picsum.photos/seed/${newPersona.name?.replace(/\s/g, '')}${Date.now()}/100/100`
    };

    const updatedList = [persona, ...customPersonas];
    setCustomPersonas(updatedList);
    localStorage.setItem('pitchPerfect_custom_personas', JSON.stringify(updatedList));
    
    setIsModalOpen(false);
    setNewPersona({
      difficulty: 'Medium',
      name: '',
      role: '',
      description: '',
      systemInstruction: ''
    });
  };

  const handleDeleteCustomPersona = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this persona?")) {
      const updatedList = customPersonas.filter(p => p.id !== id);
      setCustomPersonas(updatedList);
      localStorage.setItem('pitchPerfect_custom_personas', JSON.stringify(updatedList));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Donor</h1>
        <p className="text-slate-600 text-lg">Select a persona to practice your pitch with, or create your own custom scenario.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Create New Persona Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 group min-h-[350px]"
        >
          <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-slate-400 group-hover:text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Create Custom</h3>
          <p className="text-slate-500 text-center text-sm px-4">
            Design your own donor personality, difficulty, and objections.
          </p>
        </button>

        {/* Custom Personas */}
        {customPersonas.map((persona) => (
          <div
            key={persona.id}
            onClick={() => onSelect(persona)}
            className="relative flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border-2 border-indigo-100 hover:border-indigo-500 hover:shadow-md transition-all duration-300 group text-left h-full cursor-pointer"
          >
            <button 
              onClick={(e) => handleDeleteCustomPersona(e, persona.id)}
              className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
              title="Delete Persona"
            >
              <Trash2 size={16} />
            </button>
            <div className="relative mb-4 shrink-0">
               <img 
                 src={persona.avatar} 
                 alt={persona.name} 
                 className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors"
               />
               <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                 ${persona.difficulty === 'Easy' ? 'bg-green-500' : persona.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{persona.name}</h3>
            <p className="text-indigo-600 font-medium text-xs mb-4 flex items-center gap-1.5 text-center min-h-[1.5em]">
              {getRoleIcon(persona.role)}
              {persona.role}
            </p>
            
            <p className="text-slate-500 text-sm leading-relaxed text-center mb-6 flex-grow">
              {persona.description}
            </p>

            <span className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Start Custom Practice
            </span>
          </div>
        ))}

        {/* Default Personas */}
        {DEFAULT_PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelect(persona)}
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-md transition-all duration-300 group text-left h-full"
          >
            <div className="relative mb-4 shrink-0">
               <img 
                 src={persona.avatar} 
                 alt={persona.name} 
                 className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 group-hover:border-indigo-100 transition-colors"
               />
               <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                 ${persona.difficulty === 'Easy' ? 'bg-green-500' : persona.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{persona.name}</h3>
            <p className="text-indigo-600 font-medium text-xs mb-4 flex items-center gap-1.5 text-center min-h-[1.5em]">
              {getRoleIcon(persona.role)}
              {persona.role}
            </p>
            
            <p className="text-slate-500 text-sm leading-relaxed text-center mb-6 flex-grow">
              {persona.description}
            </p>

            <span className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Start Practice
            </span>
          </button>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus size={22} className="text-indigo-600" />
                Create Custom Persona
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    value={newPersona.name}
                    onChange={(e) => setNewPersona({...newPersona, name: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role Title</label>
                  <input
                    type="text"
                    value={newPersona.role}
                    onChange={(e) => setNewPersona({...newPersona, role: e.target.value})}
                    placeholder="e.g. Angel Investor"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setNewPersona({...newPersona, difficulty: diff as any})}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        newPersona.difficulty === diff 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Public Bio (Seen on card)</label>
                <textarea
                  value={newPersona.description}
                  onChange={(e) => setNewPersona({...newPersona, description: e.target.value})}
                  placeholder="Short description of who they are and what they care about..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[80px] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">AI Personality Instructions</label>
                <p className="text-xs text-slate-400 mb-2">Tell the AI how to behave. Be specific about their attitude, skepticism, and what convinces them.</p>
                <textarea
                  value={newPersona.systemInstruction}
                  onChange={(e) => setNewPersona({...newPersona, systemInstruction: e.target.value})}
                  placeholder="You are [Name]. You are very skeptical about... You care deeply about... You speak in short sentences..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[120px] text-sm font-mono bg-slate-50"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomPersona}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Save Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;