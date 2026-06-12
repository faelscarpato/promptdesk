import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar, MobileDock, MobileDrawer } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProjectBuilder } from './pages/ProjectBuilder';
import { PromptMasterBuilder } from './pages/PromptMasterBuilder';
import { LLMResult } from './pages/LLMResult';
import { SettingsPage } from './pages/Settings';
import { PromptHub } from './pages/PromptHub';
import { Playground } from './pages/Playground';
import { AgentGallery } from './pages/AgentGallery';
import { ChatHistory } from './pages/ChatHistory';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Router>
      {/* ====== SHELL PRINCIPAL ====== */}
      <div
        className="flex bg-black text-white selection:bg-indigo-500/30"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* Sidebar — vis\u00edvel apenas em md+ */}
        <Sidebar />

        {/* Drawer mobile completo */}
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* ====== AREA PRINCIPAL ====== */}
        <div className="flex-1 flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>

          {/* Topbar mobile (s\u00f3 aparece em telas < md) */}
          <header className="md:hidden flex items-center justify-between
            px-4 py-3 bg-black/60 backdrop-blur border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Menu size={22} />
              </button>
              <span className="text-lg font-black text-white tracking-tighter">
                Forge<span className="text-indigo-500">AI</span>
              </span>
            </div>
          </header>

          {/* Conteudo das p\u00e1ginas */}
          <main
            className="flex-1"
            style={{ overflow: 'hidden' }}
          >
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/projects"   element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectBuilder />} />
              <Route path="/builder/:id" element={<PromptMasterBuilder />} />
              <Route path="/result"     element={<LLMResult />} />
              <Route path="/hub"        element={<PromptHub />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/settings"   element={<SettingsPage />} />
              <Route path="/agents"     element={<AgentGallery />} />
              <Route path="/history"    element={<ChatHistory />} />
            </Routes>
          </main>

          {/* Dockbar — vis\u00edvel apenas em mobile */}
          <MobileDock />
        </div>
      </div>
    </Router>
  );
}

export default App;
