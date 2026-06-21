import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // In dev, forward API + mock-portal requests to the Flask backend so the
  // frontend can use relative URLs (same as production, where Flask serves both).
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5001',
      '/mock': 'http://127.0.0.1:5001',
    },
  },
})
