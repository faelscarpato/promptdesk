import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Share2, Settings2, Sparkles, Cpu, Zap, Info } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { callLLM } from '../lib/llmClient';

export const Playground: React.FC = () => {
  const { settings } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeProviderIdx, setActiveProviderIdx] = useState(0);
  const [temp, setTemp] = useState(0.7);

  const activeProvider = settings.providers[activeProviderIdx];

  const handleRun = async () => {
    if (!prompt || !activeProvider) {
      alert("Configure um provedor de IA nas configurações primeiro!");
      return;
    }
    
    setIsExecuting(true);
    setResult("");
    
    try {
      const response = await callLLM(activeProvider, prompt, temp);
      setResult(response.content);
    } catch (error) {
      setResult(`[ERROR]: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <header className="h-24 glass border-b border-white/5 px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-2xl text-indigo-500 border border-indigo-500/20">
            <Sparkles size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">AI LABS</h1>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Experimental Playground</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase">Active Engine</span>
              <select 
                value={activeProviderIdx}
                onChange={(e) => setActiveProviderIdx(Number(e.target.value))}
                className="bg-transparent border-none p-0 text-xs font-bold text-indigo-400 focus:ring-0 cursor-pointer"
              >
                {settings.providers.map((p, i) => (
                  <option key={p.id} value={i} className="bg-slate-900 text-white">{p.name || `Provider ${i+1}`}</option>
                ))}
              </select>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase">Temperature</span>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-20 accent-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={handleRun}
            disabled={isExecuting}
            className="bg-white text-black px-10 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
          >
            {isExecuting ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : <Zap size={20} fill="currentColor" />}
            EXECUTE ENGINE
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-8 gap-6 border-r border-white/5">
          <div className="flex-1 glass rounded-[2.5rem] p-10 flex flex-col relative group">
            <div className="absolute top-8 right-10 flex gap-2">
              <button onClick={() => setPrompt('')} className="p-2 text-slate-500 hover:text-white transition-colors">
                <RotateCcw size={20} />
              </button>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Input Terminal
            </span>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Inject your prompt instructions here..."
              className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-xl leading-relaxed font-bold placeholder:text-slate-800 text-white selection:bg-indigo-500/30"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col p-8 gap-6">
          <div className={`flex-1 rounded-[2.5rem] p-10 flex flex-col border transition-all duration-700 ${result ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-black border-white/5'}`}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Cpu size={14} />
                Neural Output
              </span>
              {result && (
                <button 
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <Copy size={18} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto font-code text-lg leading-relaxed text-slate-300 selection:bg-indigo-500/30">
              {result ? (
                <div className="animate-fade-in whitespace-pre-wrap">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-5" />
                    <Sparkles size={64} className="relative opacity-10" />
                  </div>
                  <p className="font-black text-sm uppercase tracking-tighter opacity-20">Awaiting Signal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
