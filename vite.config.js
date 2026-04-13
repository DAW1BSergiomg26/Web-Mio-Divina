import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  server: {
    port: 3001,
    open: false,
    host: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['axios']
        }
      }
    }
  },
  css: {
    devSourcemap: true
  }
});