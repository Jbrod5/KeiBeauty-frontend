import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    // Vite 5 no acepta booleano: lista explícita (el '.' inicial cubre subdominios)
    allowedHosts: ['localhost', '127.0.0.1', '.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io']
  }
})
