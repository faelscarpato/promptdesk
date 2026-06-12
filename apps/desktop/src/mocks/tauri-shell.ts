// Mock de @tauri-apps/api/shell para build web
export async function open(_url: string): Promise<void> {
  window.open(_url, '_blank', 'noopener,noreferrer');
}

export class Command {
  constructor(_program: string, _args?: string | string[]) {}
  async execute(): Promise<{ code: number; stdout: string; stderr: string }> {
    return { code: 0, stdout: '', stderr: '' };
  }
  on(_event: string, _handler: unknown): this { return this; }
  spawn(): Promise<unknown> { return Promise.resolve(null); }
}
