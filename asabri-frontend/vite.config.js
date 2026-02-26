import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true, // Pastikan listen di semua interface
    strictPort: true,
    cors: true, // Izinkan cross-origin agar tidak ada hambatan header
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      clientPort: 443, // Bantu Ngrok handle websocket lewat HTTPS
      host: '0.0.0.0',
    },
    proxy: {
      '/api': {
        target: 'http://web:80',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
        },
      },
      '/sanctum': {
        target: 'http://web:80',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://web:80',
        changeOrigin: true,
      }
    }
  }
})
