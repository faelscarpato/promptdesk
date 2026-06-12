import React, { useState } from 'react';
import { History, Trash2, Search, Bot, MessageSquare, Download, ChevronRight } from 'lucide-react';

export interface ChatHistoryEntry {
  id: string;
  agentId: string;
  agentName: string;
  agentCategory: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'promptforge_chat_history';

export function saveChatHistory(entry: ChatHistoryEntry) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const history: ChatHistoryEntry[] = raw ? JSON.parse(raw) : [];
  const idx = history.findIndex(h => h.id === entry.id);
  if (idx >= 0) history[idx] = entry;
  else history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 200)));
}

export function loadChatHistory(): ChatHistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const ChatHistory: React.FC = () => {
  const [history, setHistory] = useState<ChatHistoryEntry[]>(() => loadChatHistory());
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ChatHistoryEntry | null>(null);

  const filtered = history.filter(h =>
    h.agentName.toLowerCase().includes(search.toLowerCase()) ||
    h.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
    if (selected?.id === id) setSelected(null);
  };

  const handleClearAll = () => {
    if (!confirm('Apagar todo o histórico de chats?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    setSelected(null);
  };

  const handleDownload = (entry: ChatHistoryEntry) => {
    const content = entry.messages
      .map(m => `[${m.role === 'user' ? 'Você' : entry.agentName}] ${new Date(m.timestamp).toLocaleString('pt-BR')}\n${m.content}`)
      .join('\n\n---\n\n');
    downloadText(content, `chat-${entry.agentName.toLowerCase().replace(/\s+/g, '-')}-${entry.id.slice(0, 8)}.md`);
  };

  if (selected) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5 bg-black/20">
          <button
            onClick={() => setSelected(null)}
            className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            ← Histórico
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <Bot size={18} className="text-indigo-400" />
          <h2 className="text-white font-bold flex-1">{selected.agentName}</h2>
          <button
            onClick={() => handleDownload(selected)}
            className="flex items-center gap-2 text-xs px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-xl text-indigo-400 transition-all"
          >
            <Download size={13} /> Baixar .md
          </button>
          <button
            onClick={() => handleDelete(selected.id)}
            className="flex items-center gap-2 text-xs px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
          >
            <Trash2 size={13} /> Apagar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {selected.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-md'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-md'
              }`}>
                {msg.content}
                <p className="text-[10px] opacity-40 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <History size={24} className="text-indigo-400" />
            <h1 className="text-2xl font-black text-white">Histórico de Chats</h1>
            <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full border border-indigo-500/30">
              {history.length}
            </span>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-xs px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
            >
              <Trash2 size={13} /> Limpar tudo
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm">Todos os chats com agentes ficam salvos aqui</p>
      </div>

      <div className="px-8 pb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <MessageSquare size={40} className="mb-3 opacity-30" />
            <p>{history.length === 0 ? 'Nenhum chat salvo ainda' : 'Nenhum resultado encontrado'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(entry => (
              <div
                key={entry.id}
                className="group flex items-center gap-4 bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-indigo-500/20 rounded-2xl px-5 py-4 cursor-pointer transition-all"
                onClick={() => setSelected(entry)}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Bot size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{entry.agentName}</p>
                  <p className="text-slate-500 text-xs truncate">
                    {entry.messages[entry.messages.length - 1]?.content.slice(0, 80)}...
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">
                    {new Date(entry.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-slate-600">{entry.messages.length} msgs</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(entry); }}
                    className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-all"
                  >
                    <Download size={13} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
