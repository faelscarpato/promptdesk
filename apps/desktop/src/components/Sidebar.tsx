import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Library, PlayCircle,
  Settings, Zap, Bot, History, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const ALL_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/' },
  { icon: FolderKanban,   label: 'Projetos',       path: '/projects' },
  { icon: Library,        label: 'Prompt Hub',     path: '/hub' },
  { icon: Bot,            label: 'Agentes',        path: '/agents' },
  { icon: PlayCircle,     label: 'Playground',     path: '/playground' },
  { icon: History,        label: 'Histórico',      path: '/history' },
  { icon: Settings,       label: 'Configura\u00e7\u00f5es',  path: '/settings' },
];

// ======================================================
// SIDEBAR DESKTOP — hidden em mobile, flex em md+
// Visibilidade controlada 100% por Tailwind (hidden md:flex)
// ======================================================
export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const W = collapsed ? 72 : 256;

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: W,
        height: '100vh',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
      }}
    >
      {/* Logo + toggle */}
      <div
        className="shrink-0 flex items-center border-b border-white/5"
        style={{
          height: 68,
          padding: collapsed ? '0 0' : '0 18px',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5" style={{ overflow: 'hidden' }}>
          <div style={{
            background: '#4f46e5', padding: 8, borderRadius: 12, flexShrink: 0,
            boxShadow: '0 0 18px rgba(99,102,241,0.5)',
          }}>
            <Zap size={17} color="#fff" fill="#fff" />
          </div>
          {!collapsed && (
            <span
              className="text-lg font-black text-white tracking-tight uppercase whitespace-nowrap"
              style={{ letterSpacing: '-0.04em' }}
            >
              Forge<span style={{ color: '#6366f1' }}>AI</span>
            </span>
          )}
        </div>

        {/* Bot\u00e3o retrair (s\u00f3 quando expandido) */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 bg-transparent border-none cursor-pointer"
            title="Retrair"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Bot\u00e3o expandir flutuante (s\u00f3 quando retra\u00eddo) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="Expandir"
          className="absolute z-10 flex items-center justify-center
            bg-slate-900 border border-white/10 text-slate-400
            hover:text-white cursor-pointer rounded-full"
          style={{ top: 22, right: -11, width: 22, height: 22, padding: 0 }}
        >
          <ChevronRight size={12} />
        </button>
      )}

      {/* Nav */}
      <nav
        className="flex-1 flex flex-col overflow-hidden"
        style={{ padding: '10px 8px', gap: 2 }}
      >
        {ALL_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center border-none cursor-pointer font-bold
                rounded-xl transition-colors duration-150"
              style={{
                padding: collapsed ? '11px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 12,
                fontSize: 13.5,
                background: isActive ? 'rgba(50, 50, 50, 0.2)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                color: isActive ? '#fff' : '#6366f1', 
              }}
            >
              <item.icon size={19} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer (apenas expandido) */}
      {!collapsed && (
        <div className="shrink-0 p-4 border-t border-white/5">
          <div style={{
            background: 'rgba(0,0,0,0.8)', borderRadius: 14,
            padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1.5">Plano Atual</p>
            <p className="text-sm font-bold text-white">Enterprise v1.2</p>
            <div style={{ width: '100%', background: '#1e293b', height: 3, borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: '75%', background: '#4f46e5', height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// ======================================================
// DRAWER MOBILE — menu completo, desliza da esquerda
// ======================================================
export const MobileDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Painel lateral */}
      <aside
        className="fixed top-0 left-0 z-[1001] flex flex-col"
        style={{
          height: '100%',
          width: 275,
          background: '#000',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0 border-b border-white/5"
          style={{ padding: '16px 18px', height: 64 }}
        >
          <div className="flex items-center gap-2.5">
            <div style={{ background: '#4f46e5', padding: 7, borderRadius: 11 }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <span className="text-base font-black text-white uppercase tracking-tight" style={{ letterSpacing: '-0.04em' }}>
              Forge<span style={{ color: '#6366f1' }}>AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 bg-transparent border-none cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: '10px 10px' }}>
          {ALL_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                className="w-full flex items-center border-none cursor-pointer font-bold text-left"
                style={{
                  gap: 14, padding: '13px 14px', borderRadius: 14,
                  fontSize: 15, marginBottom: 2,
                  background: isActive ? 'rgba(50, 50, 50, 0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  color: isActive ? '#fff' : '#6366f1',
                }}
              >
                <item.icon size={21} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/5" style={{ padding: 14 }}>
          <div style={{
            background: 'rgba(0,0,0,0.8)', borderRadius: 14,
            padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1.5">Plano Atual</p>
            <p className="text-sm font-bold text-white">Enterprise v1.2</p>
            <div style={{ width: '100%', background: '#1e293b', height: 3, borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: '75%', background: '#4f46e5', height: '100%' }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};