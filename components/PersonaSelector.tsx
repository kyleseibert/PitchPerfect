import React from 'react';
import { Persona } from '../types';
import { Briefcase, TrendingUp, Heart, Building2, GraduationCap, Zap, Coffee } from 'lucide-react';

interface PersonaSelectorProps {
  onSelect: (persona: Persona) => void;
}

const PERSONAS: Persona[] = [
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
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Donor</h1>
        <p className="text-slate-600 text-lg">Select a persona to practice your pitch with. Each donor has different priorities and skepticism levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PERSONAS.map((persona) => (
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
    </div>
  );
};

export default PersonaSelector;