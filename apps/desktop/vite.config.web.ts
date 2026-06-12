// vite.config.web.ts — build sem Tauri para deploy web (Cloudflare Pages)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Pacotes do monorepo — aponta direto para o source
      '@prompt-engine/promptEngine': path.resolve(__dirname, '../../packages/prompt-engine/src/promptEngine.ts'),
      '@prompt-engine/moduleLibrary': path.resolve(__dirname, '../../packages/prompt-engine/src/moduleLibrary.ts'),

      // Mocks das APIs nativas do Tauri (nao existem no browser)
      '@tauri-apps/api/dialog': path.resolve(__dirname, './src/mocks/tauri-dialog.ts'),
      '@tauri-apps/api/fs':     path.resolve(__dirname, './src/mocks/tauri-fs.ts'),
      '@tauri-apps/api/shell':  path.resolve(__dirname, './src/mocks/tauri-shell.ts'),
      '@tauri-apps/api':        path.resolve(__dirname, './src/mocks/tauri-api.ts'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom', 'react-router-dom'],
          ui:      ['lucide-react', 'zustand'],
        },
      },
    },
  },
  base: '/',
});
