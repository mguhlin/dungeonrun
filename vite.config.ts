import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dungeonrun/',
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1300
  }
});
