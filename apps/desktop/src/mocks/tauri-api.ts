// Mock generico de @tauri-apps/api para build web
// Nao re-exporta os outros mocks para evitar conflito de nomes
export const invoke = async (_cmd: string, _args?: unknown): Promise<unknown> => null;
export const convertFileSrc = (src: string): string => src;
