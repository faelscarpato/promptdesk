// Mock de @tauri-apps/api/shell para build web
export async function open(url: string): Promise<void> {
  window.open(url, '_blank', 'noopener,noreferrer');
}
export class Command {
  constructor(_program: string, _args?: string | string[]) {}
  async execute() { return { code: 0, stdout: '', stderr: '' }; }
  on(_event: string, _handler: unknown): this { return this; }
  spawn(): Promise<unknown> { return Promise.resolve(null); }
}
