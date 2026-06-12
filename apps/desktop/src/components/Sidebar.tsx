import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Library, PlayCircle,
  Settings, Zap, Bot, History, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

export const ALL_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/' },
  { icon: FolderKanban,   label: 'Projetos',      path: '/projects' },
  { icon: Library,        label: 'Prompt Hub',    path: '/hub' },
  { icon: Bot,            label: 'Agentes',       path: '/agents' },
  { icon: PlayCircle,     label: 'Playground',    path: '/playground' },
  { icon: History,        label: 'Hist\u00f3rico',     path: '/history' },
  { icon: Settings,       label: 'Configura\u00e7\u00f5es', path: '/settings' },
];

// ===== SIDEBAR DESKTOP (retr\u00e1til) =====
export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 72 : 256,
        height: '100vh',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: '#4f46e5', padding: 8, borderRadius: 12,
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          {!collapsed && (
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
              Forge<span style={{ color: '#6366f1' }}>AI</span>
            </span>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            title="Retrair"
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 6, borderRadius: 8 }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Bot\u00e3o expandir (s\u00f3 quando retra\u00eddo) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="Expandir"
          style={{
            position: 'absolute', top: 18, right: -12, zIndex: 10,
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', cursor: 'pointer',
            width: 24, height: 24, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ChevronRight size={13} />
        </button>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
        {ALL_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 12,
                padding: collapsed ? '12px 0' : '10px 14px',
                borderRadius: 12,
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: isActive ? '#818cf8' : '#64748b',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.1em', marginBottom: 6 }}>Plano Atual</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Enterprise v1.2</p>
            <div style={{ width: '100%', background: '#334155', height: 4, borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: '75%', background: '#4f46e5', height: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

// ===== DRAWER MOBILE (menu completo com todos os itens) =====
export const MobileDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Painel */}
      <aside
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 1001,
          height: '100%', width: 280,
          background: '#0a0a0f',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header do drawer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#4f46e5', padding: 8, borderRadius: 12 }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
              Forge<span style={{ color: '#6366f1' }}>AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {ALL_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px',
                  borderRadius: 14,
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  cursor: 'pointer', fontWeight: 700, fontSize: 15,
                  textAlign: 'left',
                }}
              >
                <item.icon size={22} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.1em', marginBottom: 6 }}>Plano Atual</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Enterprise v1.2</p>
            <div style={{ width: '100%', background: '#334155', height: 4, borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: '75%', background: '#4f46e5', height: '100%' }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
