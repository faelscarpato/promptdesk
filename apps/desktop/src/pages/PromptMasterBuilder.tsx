import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Layers, 
  Terminal, 
  History, 
  ChevronRight,
  Code,
  Shield,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { generatePrompt } from '@prompt-engine/promptEngine';
import { callLLM } from '../lib/llmClient';
import { ModuleCard } from '../components/ModuleCard';
import { MODULE_LIBRARY } from '@prompt-engine/moduleLibrary';

export const PromptMasterBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, settings, savePromptVersion, setLLMResult } = useAppStore();
  
  const project = projects.find(p => p.id === id);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (project) {
      const modules = MODULE_LIBRARY.filter(m => selectedModules.includes(m.id));
      const prompt = generatePrompt(project, modules);
      setPreviewText(prompt);
    }
  }, [project, selectedModules]);

  if (!project) return <div className="p-20 text-center font-black text-4xl">404: WORKSPACE NOT FOUND</div>;

  const handleRun = async () => {
    if (settings.providers.length === 0) {
      alert('Configure um provedor de IA nas configurações primeiro!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await callLLM(settings.providers[0], previewText);
      
      savePromptVersion(project.id, 'default-prompt', {
        id: crypto.randomUUID(),
        versionNumber: (project.prompts[0]?.versions?.length || 0) + 1,
        content: previewText,
        createdAt: new Date().toISOString(),
        tokens: result.tokens_used
      });

      setLLMResult(result);
      navigate('/result');
    } catch (error) {
      alert(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden animate-fade-in">
      {/* Sidebar: Library */}
      <aside className="w-96 glass border-r border-white/5 flex flex-col">
        <header className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(`/project/${project.id}`)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black tracking-tight uppercase">Intelligence Hub</h2>
          </div>
          <div className="relative">
            <Terminal className="absolute left-4 top-3.5 text-slate-600" size={16} />
            <input 
              placeholder="Search modules..." 
              className="w-full bg-white/5 border-none rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {MODULE_LIBRARY.map(module => (
            <div 
              key={module.id}
              onClick={() => {
                setSelectedModules(prev => 
                  prev.includes(module.id) ? prev.filter(i => i !== module.id) : [...prev, module.id]
                );
              }}
              className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedModules.includes(module.id) ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${selectedModules.includes(module.id) ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {module.category}
                </span>
                {selectedModules.includes(module.id) && <Zap size={14} fill="currentColor" />}
              </div>
              <h4 className="font-black text-sm mb-1">{module.label}</h4>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 group-hover:text-slate-300">{module.instruction}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Main: Forge Canvas */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-24 glass border-b border-white/5 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/20 p-3 rounded-2xl text-indigo-500 border border-indigo-500/20">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">PROMPT CANVA</h1>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Workspace ID: {project.id.split('-')[0]}</p>
            </div>
          </div>
          
          <button 
            onClick={handleRun}
            disabled={isGenerating}
            className="bg-white text-black px-12 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] active:scale-95"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : <Zap size={20} fill="currentColor" />}
            DEPLOY TO ENGINE
          </button>
        </header>

        <div className="flex-1 p-10 flex flex-col gap-8">
          <div className="flex-1 glass rounded-[3rem] p-12 flex flex-col relative group">
            <div className="absolute top-10 right-12 flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Preview
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-8">Generated Neural Structure</span>
            <textarea 
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-xl leading-relaxed font-bold text-slate-200 selection:bg-indigo-500/30 font-code no-scrollbar"
            />
          </div>
        </div>

        {/* Floating Context Panel */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="glass px-8 py-4 rounded-full border-white/10 flex items-center gap-6 shadow-2xl backdrop-blur-3xl">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedModules.length} MODULES</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Code size={16} className="text-cyan-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{previewText.length} CHARS</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">OPTIMIZED</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
