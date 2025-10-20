import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://tonechanger.onrender.com'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
