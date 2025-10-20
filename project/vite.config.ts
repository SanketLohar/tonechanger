import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove or comment out the proxy since we're using the direct URL now
  // server: {
  //   proxy: {
  //     '/api': 'https://tonechanger.onrender.com'
  //   }
  // },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
