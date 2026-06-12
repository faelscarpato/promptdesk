import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Zap, Cpu, Activity, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const LLMResult: React.FC = () => {
  const navigate = useNavigate();
  const { llmResult } = useAppStore();

  if (!llmResult) return <div className="p-20 text-center font-black text-4xl">NO NEURAL SIGNAL DETECTED</div>;

  return (
    <div className="p-12 max-w-6xl mx-auto h-full flex flex-col animate-fade-in no-scrollbar">
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-black tracking-tighter">NEURAL <span className="text-indigo-500">RESPONSE</span></h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(llmResult.content)}
            className="flex items-center gap-2 p-4 glass rounded-2xl text-slate-400 hover:text-white transition-all"
            title="Copiar resposta"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={() => downloadText(llmResult.content, 'neural-response.md')}
            className="flex items-center gap-2 p-4 glass rounded-2xl text-slate-400 hover:text-white transition-all"
            title="Baixar como .md"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => downloadText(llmResult.content, 'neural-response.txt')}
            className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            <Download size={20} />
            BAIXAR .TXT
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Token Consumption', value: llmResult.tokens_used, icon: Cpu, color: 'text-indigo-400' },
          { label: 'Neural Latency', value: '1.2s', icon: Clock, color: 'text-cyan-400' },
          { label: 'Model Confidence', value: '98%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Engine Version', value: 'v2.0', icon: Zap, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-3xl p-6 border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 glass rounded-[3rem] p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Zap size={150} className="text-indigo-500" />
        </div>
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Decoded Output Signal</span>
          </div>
          <div className="flex-1 overflow-y-auto font-code text-xl leading-relaxed text-slate-200 selection:bg-indigo-500/30 whitespace-pre-wrap no-scrollbar">
            {llmResult.content}
          </div>
        </div>
      </div>
    </div>
  );
};
