// Mock de @tauri-apps/api/tauri para build web
// invoke nao faz nada no browser (llmClient.ts ja usa fetch direto)
export const invoke = async <T = unknown>(_cmd: string, _args?: unknown): Promise<T> => {
  throw new Error('Tauri invoke nao disponivel no browser. Use fetch direto.');
};
export const convertFileSrc = (src: string): string => src;
export const transformCallback = (_callback?: (_response: unknown) => void, _once?: boolean): number => 0;
