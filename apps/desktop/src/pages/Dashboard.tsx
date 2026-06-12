import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Zap, ArrowUpRight, Cpu, Layers, Activity } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, createProject, executionLogs } = useAppStore();

  const handleNewProject = () => {
    const id = crypto.randomUUID();
    createProject({
      id,
      name: 'New Architecture',
      niche: 'Geral',
      files: [],
      prompts: [],
      versions: [],
      createdAt: new Date().toISOString(),
    });
    navigate(`/project/${id}`);
  };

  const totalTokens = executionLogs.reduce((acc, log) => acc + log.tokens, 0);

  const stats = [
    { label: 'Active Projects',  value: projects.length,             icon: Layers,   color: 'text-indigo-400' },
    { label: 'Tokens Consumed',  value: totalTokens.toLocaleString(), icon: Cpu,      color: 'text-cyan-400' },
    { label: 'Executions',       value: executionLogs.length,         icon: Activity, color: 'text-emerald-400' },
    { label: 'Avg Latency',      value: '1.2s',                       icon: Clock,    color: 'text-orange-400' },
  ];

  return (
    // Pagina ocupa h-full, header+stats fixos, lista de projetos rola
    <div className="flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>

      {/* ===== HEADER + STATS (fixos) ===== */}
      <div className="px-12 pt-12 pb-8 shrink-0">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">Command Center</p>
            <h1 className="text-6xl font-black tracking-tighter leading-none">
              FORGE<span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-slate-400 mt-4 font-medium">Orquestre inteligência. Construa resultados.</p>
          </div>
          <button
            onClick={handleNewProject}
            className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus size={20} /> NEW PROJECT
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-3xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <stat.icon size={16} className={stat.color} />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== LISTA DE PROJETOS (rola) ===== */}
      <div className="flex-1 overflow-y-auto px-12 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black uppercase tracking-tighter">Active Workspaces</h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Zap size={14} className="text-indigo-400" />
            {projects.length} deployments
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="glass rounded-[2.5rem] p-16 text-center border border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Layers size={32} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-bold">No active workspaces detected. Start a new deployment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="glass rounded-[2rem] p-8 cursor-pointer hover:border-indigo-500/30 border border-white/5 transition-all hover:scale-[1.02] group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl">
                    <Layers size={20} className="text-indigo-400" />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-lg font-black mb-2 tracking-tight">{project.name}</h3>
                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                  {project.niche}
                </span>
                <p className="text-slate-600 text-xs mt-4">
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
