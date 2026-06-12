import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Bot, Settings } from 'lucide-react';
import { Sidebar, MobileDrawer } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProjectBuilder } from './pages/ProjectBuilder';
import { PromptMasterBuilder } from './pages/PromptMasterBuilder';
import { LLMResult } from './pages/LLMResult';
import { SettingsPage } from './pages/Settings';
import { PromptHub } from './pages/PromptHub';
import { Playground } from './pages/Playground';
import { AgentGallery } from './pages/AgentGallery';
import { ChatHistory } from './pages/ChatHistory';

const DOCK_ITEMS = [
  { icon: LayoutDashboard, label: 'Home',    path: '/' },
  { icon: Bot,             label: 'Agentes', path: '/agents' },
  { icon: Settings,        label: 'Config',  path: '/settings' },
];

/* Dockbar fica FORA do main para nunca ser cortado por overflow:hidden */
function MobileDock() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '10px',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
      }}
      className="md:hidden"
    >
      {DOCK_ITEMS.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 24px' }}
          >
            <item.icon
              size={24}
              style={{ color: isActive ? '#818cf8' : '#64748b' }}
            />
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: isActive ? '#818cf8' : '#64748b',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Label da pagina atual para o topbar
  const pageLabels: Record<string, string> = {
    '/': 'Dashboard', '/projects': 'Projetos', '/hub': 'Prompt Hub',
    '/agents': 'Agentes', '/playground': 'Playground',
    '/history': 'Hist\u00f3rico', '/settings': 'Configura\u00e7\u00f5es',
    '/result': 'Resultado',
  };
  const currentLabel = pageLabels[location.pathname] ??
    (location.pathname.startsWith('/project') ? 'Projeto' :
     location.pathname.startsWith('/builder') ? 'Builder' : 'ForgeAI');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#000', color: '#fff' }}>

      {/* ===== SIDEBAR DESKTOP ===== */}
      <Sidebar />

      {/* ===== DRAWER MOBILE ===== */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ===== COLUNA DIREITA ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar mobile */}
        <header
          className="md:hidden"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: 8, cursor: 'pointer', borderRadius: 10 }}
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
              Forge<span style={{ color: '#6366f1' }}>AI</span>
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>{currentLabel}</span>
        </header>

        {/* Area de conteudo */}
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/projects"    element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectBuilder />} />
            <Route path="/builder/:id" element={<PromptMasterBuilder />} />
            <Route path="/result"      element={<LLMResult />} />
            <Route path="/hub"         element={<PromptHub />} />
            <Route path="/playground"  element={<Playground />} />
            <Route path="/settings"    element={<SettingsPage />} />
            <Route path="/agents"      element={<AgentGallery />} />
            <Route path="/history"     element={<ChatHistory />} />
          </Routes>
        </main>

        {/* Espacador para o dock nao cobrir o conteudo em mobile */}
        <div className="md:hidden" style={{ height: 70, flexShrink: 0 }} />
      </div>

      {/* ===== DOCKBAR (position:fixed, fora de qualquer overflow) ===== */}
      <MobileDock />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
