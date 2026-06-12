import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  PlayCircle,
  Settings,
  Zap,
  Bot,
  History,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderKanban, label: 'Projetos', path: '/projects' },
    { icon: Library, label: 'Prompt Hub', path: '/hub' },
    { icon: Bot, label: 'Agentes', path: '/agents' },
    { icon: PlayCircle, label: 'Playground', path: '/playground' },
    { icon: History, label: 'Histórico', path: '/history' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-black/40 backdrop-blur-2xl text-slate-400 flex flex-col h-screen border-r border-white/5">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Zap size={24} fill="currentColor" />
        </div>
        <span className="text-2xl font-black text-white tracking-tighter uppercase">Forge<span className="text-indigo-500">AI</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                ${isActive
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
                  : 'hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Plano Atual</p>
          <p className="text-sm font-bold text-white">Enterprise v1.2</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full w-3/4"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
