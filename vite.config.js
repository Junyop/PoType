// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // otomatik tarayıcı açar
    port: 5173, // default, istersen değiştir
  },
  resolve: {
    alias: {
      '@': '/src', // import kısaltması: import X from '@/components/X'
    },
  },
})
