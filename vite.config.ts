import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devApiProxy =
  process.env.VITE_DEV_API_PROXY ?? 'http://127.0.0.1:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: devApiProxy,
        changeOrigin: true,
      },
    },
  },
})
