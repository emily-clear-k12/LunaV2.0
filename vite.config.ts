import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://emily-clear-k12.github.io/LunaV2.0/
export default defineConfig({
  plugins: [react()],
  base: '/LunaV2.0/',
})
