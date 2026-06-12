// Mock de @tauri-apps/api/dialog para build web
export async function open(_options?: unknown): Promise<string | string[] | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.txt,.md';
    input.onchange = () => {
      const files = Array.from(input.files ?? []).map(f => f.name);
      resolve(files.length === 1 ? files[0] : files);
    };
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
export async function save(_options?: unknown): Promise<string | null> { return null; }
export async function message(_msg: string): Promise<void> {}
export async function ask(_msg: string): Promise<boolean> { return false; }
export async function confirm(_msg: string): Promise<boolean> { return false; }
