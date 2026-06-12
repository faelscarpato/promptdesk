// vite.config.web.ts — build para deploy web (Cloudflare Pages)
// Substitui APIs nativas do Tauri por mocks/implementacoes web
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Pacotes do monorepo
      { find: '@core/types',                   replacement: path.resolve(__dirname, '../../packages/core/src/types.ts') },
      { find: '@core',                         replacement: path.resolve(__dirname, '../../packages/core/src/index.ts') },
      { find: '@prompt-engine/promptEngine',   replacement: path.resolve(__dirname, '../../packages/prompt-engine/src/promptEngine.ts') },
      { find: '@prompt-engine/moduleLibrary',  replacement: path.resolve(__dirname, '../../packages/prompt-engine/src/moduleLibrary.ts') },

      // Mocks do Tauri (sub-paths primeiro, depois o generico)
      { find: '@tauri-apps/api/tauri',         replacement: path.resolve(__dirname, './src/mocks/tauri-invoke.ts') },
      { find: '@tauri-apps/api/dialog',        replacement: path.resolve(__dirname, './src/mocks/tauri-dialog.ts') },
      { find: '@tauri-apps/api/fs',            replacement: path.resolve(__dirname, './src/mocks/tauri-fs.ts') },
      { find: '@tauri-apps/api/shell',         replacement: path.resolve(__dirname, './src/mocks/tauri-shell.ts') },
      { find: '@tauri-apps/api',               replacement: path.resolve(__dirname, './src/mocks/tauri-api.ts') },
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui:     ['lucide-react', 'zustand'],
        },
      },
    },
  },
  base: '/',
});
