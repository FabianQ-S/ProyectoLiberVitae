import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: './', // Importante para Electron: usar rutas relativas
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['better-sqlite3'], // Excluir better-sqlite3 del bundle del navegador
      output: {
        manualChunks: undefined // Evitar chunking excesivo que puede causar problemas en Electron
      }
    }
  },
  optimizeDeps: {
    exclude: ['better-sqlite3'] // No pre-bundlear better-sqlite3
  }
})
