/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno de navegador simulado para las pruebas de componentes
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false
  }
})
