import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:5000',
      '/tipos-cartera': 'http://localhost:5000',
      '/registrar': 'http://localhost:5000',
      '/consultar': 'http://localhost:5000',
    },
  },
})
