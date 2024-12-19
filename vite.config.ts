import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './frontend',
  build: {
    outDir: '../dist/public',
    emptyOutDir: false
  },
  server: {
    port: 3000
  },
  css: {
    postcss: './postcss.config.js'
  }
}); 