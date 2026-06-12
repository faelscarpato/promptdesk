import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Zap, ArrowUpRight, Cpu, Layers, Activity } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, createProject, executionLogs } = useAppStore();

  const handleNewProject = () => {
    const id = crypto.randomUUID();
    createProject({ id, name: 'New Architecture', niche: 'Geral', files: [], prompts: [], versions: [], createdAt: new Date().toISOString() });
    navigate(`/project/${id}`);
  };

  const totalTokens = executionLogs.reduce((acc, log) => acc + log.tokens, 0);
  const stats = [
    { label: 'Projetos',  value: projects.length,             icon: Layers,   color: '#818cf8' },
    { label: 'Tokens',    value: totalTokens.toLocaleString(), icon: Cpu,      color: '#22d3ee' },
    { label: 'Execu\u00e7\u00f5es', value: executionLogs.length,         icon: Activity, color: '#34d399' },
    { label: 'Lat\u00eancia',  value: '1.2s',                       icon: Clock,    color: '#fb923c' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header + stats — fixo */}
      <div style={{ padding: '24px 20px 16px', flexShrink: 0 }} className="md:px-12 md:pt-10">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.2em', marginBottom: 4 }}>Command Center</p>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: '#fff' }}>
              FORGE<span style={{ color: '#6366f1' }}>AI</span>
            </h1>
            <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>Orquestre intelig\u00eancia. Construa resultados.</p>
          </div>
          <button
            onClick={handleNewProject}
            style={{
              background: '#fff', color: '#000', padding: '12px 20px',
              borderRadius: 16, fontWeight: 900, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#000'; }}
          >
            <Plus size={18} /> NOVO PROJETO
          </button>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <s.icon size={14} style={{ color: s.color }} />
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.1em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de projetos — rola */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }} className="md:px-12">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 }}>
          <h2 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>Workspaces</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12 }}>
            <Zap size={12} style={{ color: '#818cf8' }} />
            {projects.length} projetos
          </div>
        </div>

        {projects.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24, padding: '40px 20px', textAlign: 'center',
          }}>
            <Layers size={32} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
            <p style={{ color: '#334155', fontWeight: 700, fontSize: 14 }}>Nenhum workspace. Crie o primeiro.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 12 }} className="sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20, padding: '20px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: 10, borderRadius: 12 }}>
                    <Layers size={18} style={{ color: '#818cf8' }} />
                  </div>
                  <ArrowUpRight size={14} style={{ color: '#334155' }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{project.name}</h3>
                <span style={{
                  fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                  color: '#818cf8', background: 'rgba(99,102,241,0.1)',
                  padding: '3px 10px', borderRadius: 99,
                }}>{project.niche}</span>
                <p style={{ color: '#334155', fontSize: 11, marginTop: 10 }}>
                  {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
