import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const ALL_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/' },
  { icon: FolderKanban,   label: 'Projetos',      path: '/projects' },
  { icon: Library,        label: 'Prompt Hub',    path: '/hub' },
  { icon: Bot,            label: 'Agentes',       path: '/agents' },
  { icon: PlayCircle,     label: 'Playground',    path: '/playground' },
  { icon: History,        label: 'Hist\u00f3rico',     path: '/history' },
  { icon: Settings,       label: 'Configura\u00e7\u00f5es', path: '/settings' },
];

const DOCK_ITEMS = [
  { icon: LayoutDashboard, label: 'Home',   path: '/' },
  { icon: Bot,             label: 'Agentes', path: '/agents' },
  { icon: Settings,        label: 'Config',  path: '/settings' },
];

// ─── Dockbar mobile ────────────────────────────────────────────────────────────
export const MobileDock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around
                 bg-black/80 backdrop-blur-2xl border-t border-white/10
                 px-4 pb-safe pt-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      {DOCK_ITEMS.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-all ${
              isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon size={22} />
            <span className={`text-[10px] font-bold ${
              isActive ? 'text-indigo-400' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

// ─── Sidebar desktop (retrátil) ────────────────────────────────────────────────
export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden md:flex flex-col
        bg-black/40 backdrop-blur-2xl text-slate-400
        border-r border-white/5 shrink-0
        transition-all duration-300 ease-in-out
        ${ collapsed ? 'w-[72px]' : 'w-64' }
      `}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Logo + bot\u00e3o retrair */}
      <div className={`flex items-center shrink-0 border-b border-white/5
        ${ collapsed ? 'justify-center py-5 px-0' : 'justify-between px-6 py-5' }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Forge<span className="text-indigo-500">AI</span>
            </span>
          </div>
        )}

        {collapsed && (
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Zap size={20} fill="currentColor" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(v => !v)}
          className={`p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all
            ${ collapsed ? 'absolute right-[-14px] bg-slate-900 border border-white/10 z-10 rounded-full' : '' }`}
          title={ collapsed ? 'Expandir sidebar' : 'Retrair sidebar' }
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 mt-4 overflow-hidden">
        {ALL_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={ collapsed ? item.label : undefined }
              className={`
                w-full flex items-center rounded-xl font-bold transition-all
                ${ collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3' }
                ${ isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                    : 'hover:bg-slate-800 hover:text-slate-200 border border-transparent' }
              `}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer — s\u00f3 aparece expandido */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Plano Atual</p>
            <p className="text-sm font-bold text-white">Enterprise v1.2</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-600 h-full w-3/4" />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// ─── Drawer mobile (menu completo) ─────────────────────────────────────────────
export const MobileDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${ open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-slate-950 border-r border-white/10
          flex flex-col transition-transform duration-300 ease-in-out
          ${ open ? 'translate-x-0' : '-translate-x-full' }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Forge<span className="text-indigo-500">AI</span>
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {ALL_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
                  ${ isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                      : 'hover:bg-slate-800 hover:text-slate-200 border border-transparent' }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Plano Atual</p>
            <p className="text-sm font-bold text-white">Enterprise v1.2</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-600 h-full w-3/4" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
