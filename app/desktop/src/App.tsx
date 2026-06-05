import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProjectBuilder } from './pages/ProjectBuilder';
import { PromptMasterBuilder } from './pages/PromptMasterBuilder';
import { LLMResult } from './pages/LLMResult';
import { SettingsPage } from './pages/Settings';
import { PromptHub } from './pages/PromptHub';
import { Playground } from './pages/Playground';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-black text-white selection:bg-indigo-500/30">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectBuilder />} />
            <Route path="/builder/:id" element={<PromptMasterBuilder />} />
            <Route path="/result" element={<LLMResult />} />
            <Route path="/hub" element={<PromptHub />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
