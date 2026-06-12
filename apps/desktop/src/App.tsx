import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProjectBuilder } from './pages/ProjectBuilder';
import { PromptMasterBuilder } from './pages/PromptMasterBuilder';
import { LLMResult } from './pages/LLMResult';
import { SettingsPage } from './pages/Settings';
import { PromptHub } from './pages/PromptHub';
import { Playground } from './pages/Playground';
import { AgentGallery } from './pages/AgentGallery';
import { ChatHistory } from './pages/ChatHistory';

// REGRA DE LAYOUT:
// - .app-shell   => h-screen, overflow:hidden  (tela inteira, NUNCA rola)
// - .app-sidebar => h-screen, overflow:hidden  (sidebar fixa)
// - .app-main    => flex-1, h-screen, overflow:hidden  (area de conteudo, nao rola)
// - cada pagina e responsavel por criar sua propria area de scroll interna

function App() {
  return (
    <Router>
      <div
        className="flex bg-black text-white selection:bg-indigo-500/30"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* Sidebar — nunca rola */}
        <Sidebar />

        {/* Area principal — nunca rola no nivel raiz */}
        <main
          className="flex-1 flex flex-col"
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectBuilder />} />
            <Route path="/builder/:id" element={<PromptMasterBuilder />} />
            <Route path="/result" element={<LLMResult />} />
            <Route path="/hub" element={<PromptHub />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/agents" element={<AgentGallery />} />
            <Route path="/history" element={<ChatHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
