/**
 * PromptForge Pro - Core Type Definitions
 */

export interface PromptModule {
  id: string;
  label: string;
  category: string;
  niche: 'TI' | 'Marketing' | 'Jurídico' | 'Geral';
  instruction: string;
  variables: string[];
  version: string;
  createdAt: string;
}

export interface PromptVersion {
  id: string;
  versionNumber: number;
  content: string;
  createdAt: string;
  tokens: number;
}

export interface PromptMaster {
  id: string;
  title: string;
  modules: PromptModule[];
  context: string;
  outputFormat: 'json' | 'yaml' | 'txt' | 'md';
  niche: string;
  tags: string[];
  versions: PromptVersion[];
  currentVersionId?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  niche: string;
  moduleIds: string[];
  category: string;
  icon?: string;
}

export interface TaskStep {
  id: string;
  promptId: string;
  order: number;
  label: string;
}

export interface TaskWorkflow {
  id: string;
  name: string;
  description: string;
  steps: TaskStep[];
  createdAt: string;
}

export interface ExecutionLog {
  id: string;
  promptId: string;
  provider: string;
  model: string;
  input: string;
  output: string;
  tokens: number;
  latency: number;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface FileContext {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'xlsx' | 'docx' | 'txt';
  extractedText: string;
  metadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  niche: string;
  files: FileContext[];
  prompts: PromptMaster[];
  createdAt: string;
versions: Version[]; 
}

export interface LLMProvider {
  id: string;
  name: 'openai' | 'claude' | 'gemini' | 'ollama';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface AppSettings {
  providers: LLMProvider[];
  theme: 'light' | 'dark';
  shortcuts: Record<string, string>;
}

export interface LLMResponse {
  content: string;
  tokens_used: number;
}
