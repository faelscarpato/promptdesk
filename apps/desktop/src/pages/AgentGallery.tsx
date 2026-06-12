import React, { useState, useRef, useEffect } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { callLLM } from '../lib/llmClient';
import { useAppStore } from '../store/appStore';
import { saveChatHistory, ChatHistoryEntry } from './ChatHistory';
import { AGENTS, CATEGORY_COLORS, CATEGORY_ICONS, Agent, AgentCategory } from '../data/agents';
import {
  Bot, Send, Paperclip, Download, Copy, Check,
  X, ChevronLeft, Search, Code2, FileText, Image as ImageIcon, Sparkles
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  files?: string[];
  timestamp: Date;
}

function detectCodeBlock(text: string): { isCode: boolean; language: string; code: string } {
  const match = text.match(/```([\w]*)?\n([\s\S]*?)```/);
  if (match) return { isCode: true, language: match[1] || 'text', code: match[2].trim() };
  return { isCode: false, language: '', code: '' };
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

// ---------- CodeCanvas ----------
const CodeCanvas: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleDownload = () => {
    const ext: Record<string, string> = {
      typescript: 'ts', javascript: 'js', python: 'py', rust: 'rs',
      html: 'html', css: 'css', json: 'json', markdown: 'md',
      sql: 'sql', bash: 'sh', shell: 'sh',
    };
    downloadText(code, `codigo.${ext[language] ?? language ?? 'txt'}`);
  };
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-indigo-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">{language || 'código'}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
            <Download size={12} /> Baixar
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap max-h-96"><code>{code}</code></pre>
    </div>
  );
};

// ---------- MessageBubble ----------
const MessageBubble: React.FC<{ msg: ChatMessage; agentName: string }> = ({ msg, agentName }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';
  const codeBlock = !isUser ? detectCodeBlock(msg.content) : { isCode: false, language: '', code: '' };
  const textContent = codeBlock.isCode
    ? msg.content.replace(/```[\w]*?\n[\s\S]*?```/, '').trim()
    : msg.content;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3 mt-1 shrink-0">
          <Bot size={14} />
        </div>
      )}
      <div className={`max-w-[80%] ${
        isUser
          ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-md px-4 py-3'
          : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-md px-4 py-3 border border-slate-700'
      }`}>
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {msg.files.map((f, i) => (
              <span key={i} className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-lg">
                <Paperclip size={10} />{f}
              </span>
            ))}
          </div>
        )}
        {textContent && <p className="text-sm leading-relaxed whitespace-pre-wrap">{textContent}</p>}
        {codeBlock.isCode && <CodeCanvas code={codeBlock.code} language={codeBlock.language} />}
        {!isUser && (
          <div className="flex gap-3 mt-3 pt-2 border-t border-slate-700">
            <button
              onClick={() => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button
              onClick={() => downloadText(msg.content, `resposta-${agentName.toLowerCase().replace(/\s+/g, '-')}.md`)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Download size={11} /> Baixar .md
            </button>
          </div>
        )}
        <p className="text-[10px] mt-1 opacity-40">
          {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ---------- AgentChat ----------
// ESTRUTURA:
//   [header fixo]          shrink-0
//   [mensagens scroll]     flex-1 overflow-y-auto
//   [arquivos anexados]    shrink-0 (condicional)
//   [input fixo]           shrink-0
const AgentChat: React.FC<{ agent: Agent; onBack: () => void }> = ({ agent, onBack }) => {
  const sessionId = useRef(crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: `Olá! Sou o **${agent.name}**. ${agent.desc}\n\nComo posso te ajudar hoje?`,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeProviderIdx, setActiveProviderIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useAppStore();
  const activeProvider = settings.providers[activeProviderIdx];

  // Auto-scroll ao receber nova mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Salva historico no localStorage
  useEffect(() => {
    if (messages.length <= 1) return;
    const entry: ChatHistoryEntry = {
      id: sessionId.current,
      agentId: agent.id,
      agentName: agent.name,
      agentCategory: agent.category,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
      createdAt: messages[0].timestamp.toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveChatHistory(entry);
  }, [messages]);

  const handleAttach = async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{ name: 'Suportados', extensions: ['pdf', 'txt', 'md'] }],
      });
      if (!selected) return;
      const paths = Array.isArray(selected) ? selected : [selected];
      const files = await Promise.all(paths.map(async (p) => {
        const bytes = await readBinaryFile(p);
        const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
        return { name: p.split(/[\\/]/).pop() ?? p, content: text.slice(0, 8000) };
      }));
      setAttachedFiles(prev => [...prev, ...files]);
    } catch (e) { console.error(e); }
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    if (!activeProvider) {
      alert('Configure um provedor de IA nas Configurações primeiro!');
      return;
    }
    const userContent = [
      input,
      ...attachedFiles.map(f => `\n\n--- Arquivo: ${f.name} ---\n${f.content}`),
    ].join('');
    const userMsg: ChatMessage = {
      role: 'user',
      content: userContent,
      files: attachedFiles.map(f => f.name),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const history = messages
      .map(m => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}`)
      .join('\n');
    const fullPrompt = [
      agent.systemPrompt,
      '\n\n--- Histórico ---\n' + history,
      '\n\nUsuário: ' + userContent,
      '\n\nAssistente:',
    ].join('');

    try {
      const res = await callLLM(activeProvider, fullPrompt, 0.7);
      setMessages(prev => [...prev, { role: 'assistant', content: res.content, timestamp: new Date() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Erro: ${e}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const categoryColor = CATEGORY_COLORS[agent.category];

  return (
    // h-full + overflow:hidden garante que este componente ocupa exatamente
    // o espaco disponivel sem vazar para fora
    <div className="flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>

      {/* ===== HEADER FIXO ===== */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Galeria</span>
        </button>
        <div className="w-px h-6 bg-slate-700" />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-lg shrink-0">
            {CATEGORY_ICONS[agent.category]}
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-sm truncate">{agent.name}</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColor}`}>
              {agent.subcategory}
            </span>
          </div>
        </div>
        {settings.providers.length > 1 && (
          <select
            value={activeProviderIdx}
            onChange={(e) => setActiveProviderIdx(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs text-indigo-400 font-bold rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer shrink-0"
          >
            {settings.providers.map((p, i) => (
              <option key={p.id} value={i} className="bg-slate-900 text-white">
                {p.name || `Provider ${i + 1}`}
              </option>
            ))}
          </select>
        )}
        {agent.isImageAgent && (
          <span className="flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 shrink-0">
            <ImageIcon size={12} /> Geração de Imagem
          </span>
        )}
      </div>

      {/* ===== AREA DE MENSAGENS (UNICA QUE ROLA) ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} agentName={agent.name} />
        ))}
        {loading && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        {/* Ancora de scroll — sempre visivel ao final */}
        <div ref={bottomRef} />
      </div>

      {/* ===== ARQUIVOS ANEXADOS (fixo, condicional) ===== */}
      {attachedFiles.length > 0 && (
        <div className="px-6 py-2 flex flex-wrap gap-2 border-t border-slate-800 bg-black/20 shrink-0">
          {attachedFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
              <FileText size={12} className="text-indigo-400" />
              <span className="text-xs text-slate-300">{f.name}</span>
              <button
                onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))}
                className="text-slate-500 hover:text-red-400 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ===== INPUT FIXO NA PARTE INFERIOR ===== */}
      <div className="px-6 py-4 border-t border-white/5 bg-black/40 backdrop-blur shrink-0">
        <div className="flex items-end gap-3 bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
          <button
            onClick={handleAttach}
            title="Anexar PDF, TXT ou MD"
            className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0 mb-1"
          >
            <Paperclip size={20} />
          </button>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-slate-500 max-h-36 min-h-[24px]"
            placeholder="Mensagem... (Enter envia, Shift+Enter nova linha)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && attachedFiles.length === 0)}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2 transition-all mb-1"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Provedor: {activeProvider?.name || activeProvider?.model || 'Não configurado'} • PDF, TXT, MD suportados
        </p>
      </div>
    </div>
  );
};

// ---------- AgentCard ----------
const AgentCard: React.FC<{ agent: Agent; onClick: () => void }> = ({ agent, onClick }) => {
  const color = CATEGORY_COLORS[agent.category];
  const icon = CATEGORY_ICONS[agent.category];
  return (
    <button
      onClick={onClick}
      className="group text-left bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-200 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl">{icon}</div>
        {agent.isImageAgent && (
          <span className="flex items-center gap-1 text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
            <Sparkles size={9} /> IA Visual
          </span>
        )}
      </div>
      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-indigo-300 transition-colors line-clamp-1">{agent.name}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{agent.desc}</p>
      <span className={`text-[10px] px-2 py-1 rounded-full border ${color}`}>{agent.subcategory}</span>
    </button>
  );
};

// ---------- AgentGallery ----------
export const AgentGallery: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'Todos'>('Todos');

  const categories: (AgentCategory | 'Todos')[] = [
    'Todos', 'Programação', 'Educação', 'Produtividade', 'Escrita',
    'Pesquisa e análise', 'Engenharia', 'Geração de Imagem', 'Estilo de vida',
  ];

  const filtered = AGENTS.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Todos' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Quando um agente esta selecionado, ocupa h-full sem scroll externo
  if (selectedAgent) {
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <AgentChat agent={selectedAgent} onBack={() => setSelectedAgent(null)} />
      </div>
    );
  }

  // Lista de agentes: header e filtros fixos, grid rola
  return (
    <div className="flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>

      {/* ===== HEADER DA GALERIA (fixo) ===== */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <Bot size={24} className="text-indigo-400" />
          <h1 className="text-2xl font-black text-white">Galeria de Agentes</h1>
          <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full border border-indigo-500/30">
            {AGENTS.length} agentes
          </span>
        </div>
        <p className="text-slate-500 text-sm">Selecione um agente para iniciar um chat especializado</p>
      </div>

      {/* ===== FILTROS (fixo) ===== */}
      <div className="px-8 pb-4 shrink-0">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar agentes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as AgentCategory | 'Todos')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {cat !== 'Todos' && CATEGORY_ICONS[cat as AgentCategory]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===== GRID DE AGENTES (unico que rola) ===== */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <Bot size={40} className="mb-3 opacity-30" />
            <p>Nenhum agente encontrado para &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(agent => (
              <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
