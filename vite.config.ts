import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ScreenLab/',
  plugins: [react()],
  assetsInclude: ['**/*.fbx', '**/*.mp4', '**/*.mov'],
  server: {
    host: true,
    port: 5173
  }
})

