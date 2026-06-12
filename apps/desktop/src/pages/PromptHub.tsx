import React, { useState } from 'react';
import { Search, Code, Megaphone, Scale, BookOpen, ArrowUpRight, Zap, Copy, Download, Check } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const TEMPLATES = [
  { id: 1, name: 'Architect Clean Code', cat: 'cat-ti', desc: 'Sistemas distribu\u00eddos e padr\u00f5es SOLID.', icon: Code,
    prompt: 'Voc\u00ea \u00e9 um arquiteto de software s\u00eanior especializado em Clean Code e SOLID.\n\nSua miss\u00e3o:\n1. Analisar o c\u00f3digo fornecido\n2. Identificar viola\u00e7\u00f5es de princ\u00edpios SOLID\n3. Sugerir refatora\u00e7\u00f5es com exemplos concretos\n4. Priorizar melhorias por impacto\n\nSempre justifique cada sugest\u00e3o com o princ\u00edpio violado.' },
  { id: 2, name: 'SaaS Growth Copy', cat: 'cat-mkt', desc: 'Convers\u00e3o de landing pages e reten\u00e7\u00e3o.', icon: Megaphone,
    prompt: 'Voc\u00ea \u00e9 um especialista em copywriting para SaaS com foco em convers\u00e3o.\n\nSua miss\u00e3o:\n1. Criar headlines de alto impacto\n2. Estruturar proposta de valor clara\n3. Desenvolver CTAs irresist\u00edveis\n4. Reduzir obje\u00e7\u00f5es com prova social\n\nFoco em clareza, urg\u00eancia e benef\u00edcio tang\u00edvel.' },
  { id: 3, name: 'Legal Analysis AI', cat: 'cat-jur', desc: 'Conformidade e riscos contratuais.', icon: Scale,
    prompt: 'Voc\u00ea \u00e9 um assistente jur\u00eddico especializado em an\u00e1lise contratual.\n\nSua miss\u00e3o:\n1. Identificar cl\u00e1usulas de risco\n2. Verificar conformidade legal\n3. Sugerir reda\u00e7\u00f5es alternativas\n4. Alertar sobre omiss\u00f5es cr\u00edticas\n\nIMPORTANTE: Este \u00e9 um apoio preliminar, n\u00e3o substitui advogado.' },
  { id: 4, name: 'Academic Researcher', cat: 'cat-aca', desc: 'S\u00edntese de papers e formata\u00e7\u00e3o cient\u00edfica.', icon: BookOpen,
    prompt: 'Voc\u00ea \u00e9 um pesquisador acad\u00eamico especializado em s\u00edntese de literatura cient\u00edfica.\n\nSua miss\u00e3o:\n1. Sintetizar papers complexos em linguagem acess\u00edvel\n2. Identificar metodologias e resultados\n3. Comparar diferentes estudos\n4. Formatar cita\u00e7\u00f5es ABNT ou APA\n\nSeja preciso e objetivo.' },
];

export const PromptHub: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [activePrompt, setActivePrompt] = useState<typeof TEMPLATES[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { createProject } = useAppStore();

  const filtered = TEMPLATES.filter(t =>
    (selectedCat === 'all' || t.cat === selectedCat) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeploy = (t: typeof TEMPLATES[0]) => {
    const id = crypto.randomUUID();
    createProject({ id, name: t.name, niche: 'Geral', files: [], prompts: [], versions: [], createdAt: new Date().toISOString() });
    navigate(`/project/${id}`);
  };

  if (activePrompt) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => setActivePrompt(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            \u2190 Voltar
          </button>
          <h2 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: '#fff', flex: 1 }}>{activePrompt.name}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => { navigator.clipboard.writeText(activePrompt.prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              {copied ? <Check size={13} style={{ color: '#34d399' }} /> : <Copy size={13} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button onClick={() => downloadText(activePrompt.prompt, `${activePrompt.name.toLowerCase().replace(/\s+/g, '-')}.md`)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              <Download size={13} /> Baixar
            </button>
            <button onClick={() => handleDeploy(activePrompt)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', border: 'none', borderRadius: 12, color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 900 }}>
              <Zap size={13} /> Deploy
            </button>
          </div>
        </div>
        {/* Prompt */}
        <div style={{ flex: 1, overflow: 'hidden', padding: 20 }}>
          <pre style={{ height: '100%', overflowY: 'auto', fontSize: 13, color: '#cbd5e1', whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: 'rgba(15,23,42,0.8)', borderRadius: 16, padding: 20, margin: 0 }}>
            {activePrompt.prompt}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header fixo */}
      <div style={{ padding: '20px 20px 12px', flexShrink: 0 }} className="md:px-10">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', letterSpacing: '0.15em', background: 'rgba(99,102,241,0.1)', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(99,102,241,0.2)' }}>Discovery</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: '#fff', marginTop: 8 }}>
              PROMPT<span style={{ color: '#6366f1' }}>HUB</span>
            </h1>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '0 12px', flex: '0 1 220px' }}>
            <Search size={16} style={{ color: '#475569', flexShrink: 0 }} />
            <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', padding: '10px 8px', fontSize: 13, fontWeight: 600, width: '100%' }} />
          </div>
        </div>
        {/* Categorias */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {[{ id: 'all', name: 'Todos' }, ...INITIAL_CATEGORIES].map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '7px 16px', borderRadius: 99, fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap',
                cursor: 'pointer', border: '1px solid',
                background: selectedCat === cat.id ? (cat.id === 'all' ? '#fff' : '#4f46e5') : 'transparent',
                color: selectedCat === cat.id ? (cat.id === 'all' ? '#000' : '#fff') : '#64748b',
                borderColor: selectedCat === cat.id ? (cat.id === 'all' ? '#fff' : '#4f46e5') : 'rgba(255,255,255,0.08)',
              }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid rola */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 24px' }} className="md:px-10">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 16 }} className="md:grid-cols-2">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setActivePrompt(t)}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 24, padding: '24px 20px', cursor: 'pointer',
                position: 'relative', overflow: 'hidden', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.01)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, padding: 16, opacity: 0.04 }}>
                <t.icon size={80} color="#fff" />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 16 }}>
                    <t.icon size={24} color="#fff" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase' }}>
                    <Zap size={11} fill="#818cf8" color="#818cf8" /> Elite
                  </div>
                </div>
                <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 900, color: '#fff', marginBottom: 8 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t.desc}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={e => { e.stopPropagation(); handleDeploy(t); }}
                    style={{ background: '#fff', color: '#000', padding: '8px 18px', borderRadius: 12, fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer' }}>
                    Deploy
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActivePrompt(t); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}>
                    <ArrowUpRight size={20} />
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
