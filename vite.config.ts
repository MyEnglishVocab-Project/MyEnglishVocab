import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://54.180.24.42:8080',
        changeOrigin: true,
      },
    },
  },
})
