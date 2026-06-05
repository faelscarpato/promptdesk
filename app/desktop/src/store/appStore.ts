import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project, AppSettings, FileContext, LLMResponse, PromptModule, PromptVersion, PromptTemplate, TaskWorkflow, ExecutionLog, Category } from "@core/types";

// 1. Dados Iniciais de Categorias (Definidos antes da Store)
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-ti', name: 'Tecnologia', color: '#3b82f6', icon: 'Code' },
  { id: 'cat-mkt', name: 'Marketing', color: '#ec4899', icon: 'Megaphone' },
  { id: 'cat-jur', name: 'Jurídico', color: '#10b981', icon: 'Scale' },
  { id: 'cat-aca', name: 'Acadêmico', color: '#8b5cf6', icon: 'BookOpen' },
];

interface AppState {
  projects: Project[];
  settings: AppSettings;
  llmResult: LLMResponse | null;
  templates: PromptTemplate[];
  workflows: TaskWorkflow[];
  executionLogs: ExecutionLog[];
  categories: Category[];
  
  // Actions
  createProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addFileToProject: (projectId: string, file: FileContext) => void;
  addModuleToPrompt: (projectId: string, promptId: string, module: PromptModule) => void;
  savePromptVersion: (projectId: string, promptId: string, version: PromptVersion) => void;
  addExecutionLog: (log: ExecutionLog) => void;
  addCategory: (category: Category) => void;
  setLLMResult: (result: LLMResponse | null) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const initialSettings: AppSettings = {
  providers: [
    {
      id: 'default-openai',
      name: 'openai',
      apiKey: '',
      model: 'gpt-4-turbo'
    }
  ],
  theme: 'light',
  shortcuts: {
    'new-project': 'Ctrl+N',
    'run-prompt': 'Ctrl+Enter'
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: [],
      settings: initialSettings,
      llmResult: null,
      templates: [],
      workflows: [],
      executionLogs: [],
      categories: INITIAL_CATEGORIES,
      
      createProject: (project) => set((state) => ({ 
        projects: [project, ...state.projects] 
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      addFileToProject: (projectId, file) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, files: [...p.files, file] } 
            : p
        )
      })),

      addModuleToPrompt: (projectId, promptId, module) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            prompts: p.prompts.map(pr => 
              pr.id === promptId 
                ? { ...pr, modules: [...pr.modules, module] } 
                : pr
            )
          };
        })
      })),

      savePromptVersion: (projectId, promptId, version) => set((state) => ({
        projects: state.projects.map(p => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            prompts: p.prompts.map(pr => 
              pr.id === promptId 
                ? { ...pr, versions: [version, ...(pr.versions || [])], currentVersionId: version.id } 
                : pr
            )
          };
        })
      })),

      setLLMResult: (result) => set({ llmResult: result }),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      addExecutionLog: (log) => set((state) => ({
        executionLogs: [log, ...state.executionLogs].slice(0, 100)
      })),

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      }))
    }),
    {
      name: 'promptforge-storage',
      storage: createJSONStorage(() => localStorage) 
    }
  )
);
