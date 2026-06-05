import { invoke } from '@tauri-apps/api/tauri';
import { FileContext } from "@core/types";

/**
 * Invoca o comando Rust para processar um arquivo e retorna um FileContext
 */
export async function processFile(path: string): Promise<FileContext> {
  const fileName = path.split(/[\\/]/).pop() || 'unknown';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (!(window as any).__TAURI_IPC__) {
    console.warn('Tauri IPC not found. Returning mock file context.');
    return {
      id: crypto.randomUUID(),
      fileName,
      fileType: extension as any,
      extractedText: "Conteúdo simulado (Navegador). Execute via Tauri Desktop para extração real.",
      metadata: { path, processedAt: new Date().toISOString() }
    };
  }

  try {
    const extractedText = await invoke<string>('process_file', { path });

    return {
      id: crypto.randomUUID(),
      fileName,
      fileType: extension as any,
      extractedText,
      metadata: {
        path,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Erro ao processar arquivo:', error);
    throw new Error(`Falha ao ler arquivo: ${error}`);
  }
}
