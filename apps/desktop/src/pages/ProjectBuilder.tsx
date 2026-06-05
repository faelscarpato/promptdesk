import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Settings, Sparkles, Plus, Layers, Database, Globe } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { FileDropZone } from '../components/FileDropZone';

export const ProjectBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useAppStore();
  
  const project = projects.find(p => p.id === id);
  const [name, setName] = useState(project?.name || '');
  const [activeTab, setActiveTab] = useState<'assets' | 'config'>('assets');

  if (!project) return <div className="p-20 text-center font-black text-4xl">404: WORKSPACE NOT FOUND</div>;

  const handleSave = () => {
    updateProject(project.id, { name });
  };

  return (
    <div className="flex flex-col h-screen bg-black animate-fade-in">
      <nav className="h-24 glass border-b border-white/5 flex items-center justify-between px-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            className="text-2xl font-black bg-transparent border-none focus:ring-0 w-80 text-white tracking-tighter"
          />
        </div>
        <button 
          onClick={() => navigate(`/builder/${project.id}`)}
          className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-700 shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all active:scale-95"
        >
          <Sparkles size={20} />
          FORGE PROMPT
        </button>
      </nav>

      <main className="flex-1 overflow-auto p-12 no-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-12 mb-12 border-b border-white/5">
            {[
              { id: 'assets', label: 'Knowledge Assets', icon: Database },
              { id: 'config', label: 'Neural Config', icon: Settings },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-6 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all ${activeTab === tab.id ? 'border-b-2 border-indigo-500 text-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'assets' ? (
            <div className="space-y-10 animate-slide-up">
              <section className="glass rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Database size={120} />
                </div>
                <div className="relative z-10 mb-10">
                  <h2 className="text-4xl font-black mb-2 tracking-tighter">ASSET REPOSITORY</h2>
                  <p className="text-slate-500 font-medium">Inject raw data to train your prompt's context window.</p>
                </div>
                
                <FileDropZone projectId={project.id} />

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.files.map(file => (
                    <div key={file.id} className="glass rounded-3xl p-6 border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-indigo-600/20 transition-colors">
                          <FileText className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <p className="font-black text-white">{file.fileName}</p>
                          <div className="flex gap-3 items-center mt-1">
                            <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full uppercase border border-indigo-500/20">{file.fileType}</span>
                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{Math.round(file.extractedText.length / 1024)} KB RAW DATA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-10 animate-slide-up">
              <section className="glass rounded-[3rem] p-12">
                <h3 className="text-3xl font-black mb-10 tracking-tighter">NEURAL DEFINITIONS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Domain Niche</label>
                    <select 
                      value={project.niche}
                      onChange={(e) => updateProject(project.id, { niche: e.target.value })}
                      className="w-full p-5 bg-white/5 border-white/5 rounded-[1.5rem] font-black text-white focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="Geral">General Intelligence</option>
                      <option value="TI">Cyber Systems & Dev</option>
                      <option value="Marketing">Growth & Psychology</option>
                      <option value="Jurídico">Legal & Compliance</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-2">Context Sensitivity</label>
                    <div className="p-5 bg-white/5 border-white/5 rounded-[1.5rem] flex items-center justify-between">
                      <span className="font-black text-white">Adaptive Context</span>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
