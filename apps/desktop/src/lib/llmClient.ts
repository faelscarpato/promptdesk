import { invoke } from '@tauri-apps/api/tauri';
import { LLMProvider, LLMResponse } from "@core/types";

/**
 * Invoca o cliente universal de IA no Rust
 */
export async function callLLM(
  provider: LLMProvider,
  prompt: string,
  temperature: number = 0.7
): Promise<LLMResponse> {
  // Verificação de ambiente Tauri
  if (!(window as any).__TAURI_IPC__) {
    console.warn('Tauri IPC not found. Running in browser mode (Mocked).');
    return {
      content: "Modo de visualização (Navegador). Para funcionalidade real, execute via Tauri Desktop.",
      tokens_used: 0
    };
  }

  try {
    const response = await invoke<LLMResponse>('call_llm', {
      baseUrl: provider.baseUrl || 'https://api.openai.com/v1',
      apiKey: provider.apiKey,
      model: provider.model,
      prompt: prompt,
      temperature: temperature
    });

    return response;
  } catch (error) {
    console.error('AI Service Failure:', error);
    throw new Error(`${error}`);
  }
}
