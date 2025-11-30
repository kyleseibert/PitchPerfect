import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { searchForFacts } from '../services/geminiService';
import { SearchResult } from '../types';

const ResearchAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const data = await searchForFacts(query);
    setResult(data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 shadow-xl">
      <div className="p-4 bg-white border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={20} />
          Research Assistant
        </h2>
        <p className="text-xs text-slate-500 mt-1">Powered by Google Search & Gemini Flash</p>
      </div>

      <div className="p-4 bg-white border-b border-slate-200">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find stats, news, or donor info..."
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!result && !isLoading && (
          <div className="text-center text-slate-400 mt-10">
            <Search className="mx-auto mb-3 opacity-20" size={48} />
            <p className="text-sm">Search for recent events or statistics to strengthen your pitch.</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</h3>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
            </div>

            {result.sources.length > 0 && (
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">Sources</h3>
                 <ul className="space-y-2">
                   {result.sources.map((source, idx) => (
                     <li key={idx}>
                       <a 
                         href={source.uri} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-start gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all group"
                       >
                         <ExternalLink size={14} className="mt-1 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                         <div>
                           <div className="text-xs font-medium text-indigo-600 group-hover:underline truncate max-w-[200px]">
                             {source.title}
                           </div>
                           <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                             {source.uri}
                           </div>
                         </div>
                       </a>
                     </li>
                   ))}
                 </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAssistant;