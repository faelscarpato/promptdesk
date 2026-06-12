import React, { useState } from 'react';
import { Search, Sparkles, Code, Megaphone, Scale, BookOpen, ArrowUpRight, Zap, Copy, Download } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
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

const TEMPLATES = [
  {
    id: 1,
    name: 'Architect Clean Code',
    cat: 'cat-ti',
    desc: 'Otimização de sistemas distribuídos e padrões SOLID.',
    icon: Code,
    prompt: `Você é um arquiteto de software sênior especializado em Clean Code e SOLID.\n\nSua missão:\n1. Analisar o código fornecido\n2. Identificar violações de princípios SOLID\n3. Sugerir refatorações com exemplos concretos\n4. Priorizar melhorias por impacto\n\nSempre justifique cada sugestão com o princípio violado.`,
  },
  {
    id: 2,
    name: 'SaaS Growth Copy',
    cat: 'cat-mkt',
    desc: 'Focado em conversão de landing pages e retenção.',
    icon: Megaphone,
    prompt: `Você é um especialista em copywriting para SaaS com foco em conversão.\n\nSua missão:\n1. Criar headlines de alto impacto\n2. Estruturar proposta de valor clara\n3. Desenvolver CTAs irresistíveis\n4. Reduzir objeções com prova social\n\nFoco em clareza, urgência e benefício tangível.`,
  },
  {
    id: 3,
    name: 'Legal Analysis AI',
    cat: 'cat-jur',
    desc: 'Análise profunda de conformidade e riscos contratuais.',
    icon: Scale,
    prompt: `Você é um assistente jurídico especializado em análise contratual.\n\nSua missão:\n1. Identificar cláusulas de risco\n2. Verificar conformidade legal\n3. Sugerir redações alternativas\n4. Alertar sobre omissões críticas\n\nIMPORTANTE: Sempre reforce que este é um apoio preliminar e não substitui advogado.`,
  },
  {
    id: 4,
    name: 'Academic Researcher',
    cat: 'cat-aca',
    desc: 'Sintetização de papers e formatação científica.',
    icon: BookOpen,
    prompt: `Você é um pesquisador acadêmico especializado em síntese de literatura científica.\n\nSua missão:\n1. Sintetizar papers complexos em linguagem acessível\n2. Identificar metodologias e resultados principais\n3. Comparar diferentes estudos\n4. Formatar citações no padrão ABNT ou APA\n\nSeja preciso, objetivo e cite fontes quando relevante.`,
  },
];

export const PromptHub: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [activePrompt, setActivePrompt] = useState<typeof TEMPLATES[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { createProject } = useAppStore();

  const filtered = TEMPLATES.filter(t => {
    const matchCat = selectedCat === 'all' || t.cat === selectedCat;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDeploy = (template: typeof TEMPLATES[0]) => {
    const id = crypto.randomUUID();
    createProject({
      id,
      name: template.name,
      niche: 'Geral',
      files: [],
      prompts: [],
      versions: [],
      createdAt: new Date().toISOString(),
    });
    navigate(`/project/${id}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (activePrompt) {
    return (
      <div className="p-12 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActivePrompt(null)}
            className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-slate-400 hover:text-white"
          >
            ← Voltar
          </button>
          <h2 className="text-2xl font-black">{activePrompt.name}</h2>
        </div>
        <div className="flex-1 glass rounded-[2rem] p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Prompt</span>
            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(activePrompt.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-bold"
              >
                <Copy size={14} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <button
                onClick={() => downloadText(activePrompt.prompt, `${activePrompt.name.toLowerCase().replace(/\s+/g, '-')}.md`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-xl text-indigo-400 hover:text-white transition-all text-sm font-bold"
              >
                <Download size={14} />
                Baixar .md
              </button>
              <button
                onClick={() => handleDeploy(activePrompt)}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-xl font-black text-sm transition-all"
              >
                <Zap size={14} fill="currentColor" />
                Deploy
              </button>
            </div>
          </div>
          <pre className="flex-1 overflow-y-auto text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded-xl p-6">
            {activePrompt.prompt}
          </pre>
        </div>
      </div>
    );
  }

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-white px-4 py-3 w-64 font-bold focus:ring-0"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
            selectedCat === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'
          }`}
        >
          All Access
        </button>
        {INITIAL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
              selectedCat === cat.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-transparent text-slate-500 border-white/5 hover:border-white/20'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map(template => (
            <div
              key={template.id}
              className="glass rounded-[2.5rem] p-10 group hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden"
              onClick={() => setActivePrompt(template)}
            >
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
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeploy(template); }}
                    className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Deploy Template
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePrompt(template); }}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
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
