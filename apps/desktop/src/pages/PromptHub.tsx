import React, { useState } from 'react';
import { Search, Sparkles, Code, Megaphone, Scale, BookOpen, ArrowUpRight, Zap } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../store/appStore';

export const PromptHub: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');

  const templates = [
    { id: 1, name: 'Architect Clean Code', cat: 'cat-ti', desc: 'Otimização de sistemas distribuídos e padrões SOLID.', icon: Code, accent: 'indigo' },
    { id: 2, name: 'SaaS Growth Copy', cat: 'cat-mkt', desc: 'Focado em conversão de landing pages e retenção.', icon: Megaphone, accent: 'pink' },
    { id: 3, name: 'Legal Analysis AI', cat: 'cat-jur', desc: 'Análise profunda de conformidade e riscos contratuais.', icon: Scale, accent: 'emerald' },
    { id: 4, name: 'Academic Researcher', cat: 'cat-aca', desc: 'Sintetização de papers e formatação científica.', icon: BookOpen, accent: 'purple' },
  ];

  return (
    <div className="p-12 h-full flex flex-col animate-fade-in overflow-hidden">
      <header className="flex justify-between items-start mb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">Discovery</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">
            PROMPT<span className="text-indigo-500">HUB</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">O maior repositório de inteligência modular para engenheiros de elite.</p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center bg-black rounded-2xl p-1">
            <Search className="ml-4 text-slate-500" size={20} />
            <input 
              placeholder="Search intelligence..." 
              className="bg-transparent border-none text-white px-4 py-3 w-64 font-bold focus:ring-0"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setSelectedCat('all')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${selectedCat === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'}`}
        >
          All Access
        </button>
        {INITIAL_CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${selectedCat === cat.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {templates.filter(t => selectedCat === 'all' || t.cat === selectedCat).map(template => (
            <div key={template.id} className="glass rounded-[2.5rem] p-10 group hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-indigo-500/20 transition-colors">
                <template.icon size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/5 p-4 rounded-3xl group-hover:bg-indigo-600 transition-colors duration-500">
                    <template.icon className="text-white" size={32} />
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-tighter">
                    <Zap size={14} fill="currentColor" />
                    High Performance
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 group-hover:translate-x-2 transition-transform duration-500">{template.name}</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-sm">{template.desc}</p>
                
                <div className="flex items-center gap-6">
                  <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                    Deploy Template
                  </button>
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <ArrowUpRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
