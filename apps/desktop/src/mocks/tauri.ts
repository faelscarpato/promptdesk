// Mock generico de @tauri-apps/api para build web
export const invoke = async (_cmd: string, _args?: unknown): Promise<unknown> => null;
export const convertFileSrc = (src: string): string => src;

export * from './tauri-dialog';
export * from './tauri-fs';
export * from './tauri-shell';
