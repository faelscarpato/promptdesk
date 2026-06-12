// Mock de @tauri-apps/api/fs para build web
export async function readBinaryFile(_path: string): Promise<Uint8Array> {
  // No browser retorna array vazio — o AgentChat ja trata o caso
  return new Uint8Array();
}

export async function readTextFile(_path: string): Promise<string> {
  return '';
}

export async function writeFile(_path: string, _data: unknown): Promise<void> {}
export async function writeBinaryFile(_path: string, _data: unknown): Promise<void> {}
export async function removeFile(_path: string): Promise<void> {}
export async function createDir(_path: string): Promise<void> {}
export async function removeDir(_path: string): Promise<void> {}
export async function readDir(_path: string): Promise<unknown[]> { return []; }
export async function exists(_path: string): Promise<boolean> { return false; }
