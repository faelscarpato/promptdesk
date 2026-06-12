import React, { useState } from 'react';
import { Save, Globe, Shield, Zap, Plus, Trash2, Cpu } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { LLMProvider } from '@core/types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [providers, setProviders] = useState<LLMProvider[]>(settings.providers);

  const handleAddProvider = () => {
    const newProvider: LLMProvider = {
      id: crypto.randomUUID(),
      name: 'openai',
      apiKey: '',
      model: '',
      baseUrl: 'https://api.openai.com/v1'
    };
    setProviders([...providers, newProvider]);
  };

  const handleRemoveProvider = (id: string) => {
    setProviders(providers.filter(p => p.id !== id));
  };

  const handleUpdateProvider = (id: string, updates: Partial<LLMProvider>) => {
    setProviders(providers.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleSave = () => {
    updateSettings({ providers });
    alert('Configurações de infraestrutura atualizadas.');
  };

  return (
    <div className="p-12 max-w-5xl mx-auto h-full overflow-y-auto animate-fade-in">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Adicione sua <span className="text-indigo-500">IA</span></h1>
          <p className="text-slate-500 font-medium">Conecte qualquer modelo via OpenRouter, OpenAI ou endpoints locais.</p>
        </div>
        
      </header>

      <div className="space-y-6">
        {providers.map((provider, index) => (
          <section key={provider.id} className="glass rounded-[2rem] p-8 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50"></div>
            
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <Cpu className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Provedor #{index + 1}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{provider.id.split('-')[0]}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveProvider(provider.id)}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Endpoint Base (URL)</label>
                <input 
                  value={provider.baseUrl}
                  onChange={(e) => handleUpdateProvider(provider.id, { baseUrl: e.target.value })}
                  placeholder="https://openrouter.ai/api/v1"
                  className="w-full bg-black/40 border-white/5 rounded-2xl p-4 font-mono text-sm focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">API Key</label>
                <input 
                  type="password"
                  value={provider.apiKey}
                  onChange={(e) => handleUpdateProvider(provider.id, { apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full bg-black/40 border-white/5 rounded-2xl p-4 font-mono text-sm focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Modelo ID</label>
                <input 
                  value={provider.model}
                  onChange={(e) => handleUpdateProvider(provider.id, { model: e.target.value })}
                  placeholder="anthropic/claude-3-opus"
                  className="w-full bg-black/40 border-white/5 rounded-2xl p-4 font-mono text-sm focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nome Amigável</label>
                <input 
                  value={provider.name}
                  onChange={(e) => handleUpdateProvider(provider.id, { name: e.target.value as any })}
                  placeholder="Minha IA Custom"
                  className="w-full bg-black/40 border-white/5 rounded-2xl p-4 font-bold text-sm focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </section>
        ))}

        <button 
          onClick={handleAddProvider}
          className="w-full py-8 border-2 border-dashed border-white/5 rounded-[2rem] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all flex flex-col items-center gap-2 group "
        >
          <Plus size={32} className="group-hover:scale-110 transition-transform" />
          <span className="font-bold">Adicionar Novo Endpoint de IA</span>
        </button>
      </div>
   <div><button 
          onClick={handleSave}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <Save size={20} />
          Salvar
        </button></div></div>
  );
};
