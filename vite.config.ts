import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // This ensures your output goes where Vercel expects it
    outDir: 'dist',
  }
})
