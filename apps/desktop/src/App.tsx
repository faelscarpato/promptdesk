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

// Dockbar — position:fixed para nunca ser cortado por overflow:hidden
// Visibilidade controlada SOMENTE por classes Tailwind (sem display inline)
function MobileDock() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-[9999]
      items-center justify-around
      bg-black/90 backdrop-blur-xl border-t border-white/10"
      style={{ paddingTop: 10, paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}
    >
      {DOCK_ITEMS.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 px-6 py-0 bg-transparent border-none cursor-pointer"
          >
            <item.icon size={22} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
            <span className={`text-[10px] font-bold ${ isActive ? 'text-indigo-400' : 'text-slate-500' }`}>
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
    // Shell raiz — nunca rola
    <div className="flex bg-black text-white" style={{ height: '100vh', overflow: 'hidden' }}>

      {/* Sidebar — hidden em mobile, flex em md+ */}
      <Sidebar />

      {/* Drawer mobile */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Coluna de conteudo */}
      <div className="flex flex-col flex-1 min-w-0" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* Topbar — APENAS mobile (flex em < md, hidden em md+) */}
        <header className="flex md:hidden items-center justify-between shrink-0
          px-4 py-3 border-b border-white/5"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 10 }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-slate-400 bg-transparent border-none cursor-pointer rounded-xl"
            >
              <Menu size={22} />
            </button>
            <span className="text-lg font-black tracking-tight">
              Forge<span className="text-indigo-500">AI</span>
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">{currentLabel}</span>
        </header>

        {/* Conteudo das paginas */}
        <main className="flex-1" style={{ overflow: 'hidden' }}>
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

        {/* Espacador do dock — APENAS mobile */}
        <div className="block md:hidden shrink-0" style={{ height: 68 }} />
      </div>

      {/* Dockbar — renderizado aqui mas position:fixed, invisivel em md+ */}
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
