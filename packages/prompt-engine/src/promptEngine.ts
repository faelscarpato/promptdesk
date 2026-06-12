import { PromptMaster, FileContext, PromptModule, Project } from '@core/types';

/**
 * PromptForge Pro - Advanced Prompt Engine
 * Responsável por orquestrar a montagem de prompts complexos.
 */

export interface PromptGenerationOptions {
  includeMetadata: boolean;
  maxTokens?: number;
  customInstructions?: string;
}

export function composePrompt(
  master: PromptMaster,
  context: FileContext[],
  options: PromptGenerationOptions = { includeMetadata: true }
): string {
  const sections: string[] = [];

  sections.push(`# ROLE\nVocê é um especialista em ${master.niche}. Sua tarefa é processar as informações abaixo e gerar o melhor resultado possível seguindo as instruções modulares.`);

  if (context.length > 0) {
    sections.push('## CONTEXTO E DADOS DE REFERÊNCIA');
    context.forEach((file, index) => {
      sections.push(`### ARQUIVO ${index + 1}: ${file.fileName}`);
      sections.push('```text');
      sections.push(file.extractedText);
      sections.push('```');
    });
  }

  if (master.context) {
    sections.push('## OBJETIVO ESPECÍFICO');
    sections.push(master.context);
  }

  sections.push('## INSTRUÇÕES DE PROCESSAMENTO');
  master.modules.forEach((module, index) => {
    sections.push(`### PASSO ${index + 1}: ${module.label.toUpperCase()}`);
    sections.push(module.instruction);
    if (module.variables && module.variables.length > 0) {
      sections.push('**Variáveis Aplicadas:**');
      module.variables.forEach(v => sections.push(`- ${v}`));
    }
  });

  sections.push('## FORMATO DE SAÍDA');
  sections.push(`O resultado deve ser entregue estritamente no formato: ${master.outputFormat.toUpperCase()}.`);

  if (options.customInstructions) {
    sections.push(`**Instruções Adicionais:** ${options.customInstructions}`);
  }

  return sections.join('\n\n');
}

export function analyzeAndSuggest(content: string, library: PromptModule[]): PromptModule[] {
  const suggestions: PromptModule[] = [];
  const text = content.toLowerCase();
  library.forEach(module => {
    const keywords = module.label.toLowerCase().split(' ');
    const hasMatch = keywords.some(kw => kw.length > 3 && text.includes(kw));
    if (hasMatch) suggestions.push(module);
  });
  return suggestions.slice(0, 5);
}

export function generatePrompt(project: Project, selectedModules: PromptModule[]): string {
  const master: PromptMaster = {
    id: project.id,
    niche: project.niche,
    context: '',
    modules: selectedModules.map(m => ({ ...m })),
    outputFormat: 'md',
    versions: [],
  };
  return composePrompt(master, project.files);
}
