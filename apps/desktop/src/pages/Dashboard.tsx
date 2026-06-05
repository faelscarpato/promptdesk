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
      createdAt: new Date().toISOString()
    });
    navigate(`/project/${id}`);
  };

  const totalTokens = executionLogs.reduce((acc, log) => acc + log.tokens, 0);

  return (
    <div className="p-12 max-w-7xl mx-auto h-full overflow-y-auto animate-fade-in no-scrollbar">
      <header className="flex justify-between items-end mb-20">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-600/10 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">System Online</span>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none mb-4">
            COMMAND<br/><span className="text-indigo-500">CENTER</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-md">Orquestre sua infraestrutura de IA com precisão cirúrgica.</p>
        </div>
        
        <button
          onClick={handleNewProject}
          className="bg-white hover:bg-indigo-500 hover:text-white text-black px-12 py-5 rounded-[2rem] font-black flex items-center gap-3 transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.05)] group active:scale-95"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          INITIALIZE PROJECT
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { label: 'Active Projects', value: projects.length, icon: Layers, color: 'text-indigo-500' },
          { label: 'Neural Executions', value: executionLogs.length, icon: Activity, color: 'text-cyan-500' },
          { label: 'Total Tokens', value: totalTokens.toLocaleString(), icon: Cpu, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">{stat.label}</p>
            <h3 className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <section>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Clock size={24} className="text-indigo-500" />
            RECENT WORKSPACES
          </h2>
          <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">View All</button>
        </div>
        
        {projects.length === 0 ? (
          <div className="glass rounded-[3rem] p-32 text-center border-dashed border-white/5">
            <p className="text-slate-500 font-bold text-lg">No active workspaces detected. Start a new deployment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="glass rounded-[2.5rem] p-10 hover:border-indigo-500/50 cursor-pointer transition-all duration-500 group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="bg-white/5 p-4 rounded-3xl group-hover:bg-indigo-600 transition-colors duration-500">
                    <Layers className="text-white" size={28} />
                  </div>
                  <ArrowUpRight className="text-slate-700 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 group-hover:translate-x-2 transition-transform duration-500">
                  {project.name}
                </h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-8">{project.niche}</p>
                
                <div className="flex gap-4">
                  <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    {project.files.length} ASSETS
                  </span>
                  <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    {project.prompts.length} PROMPTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
