import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// Plan A (Awesome) dashboard. Served at
 // https://emily-clear-k12.github.io/LunaV2.0/dashboard-a/
// Output lands in ../dist/dashboard-a. Plans B–D are plain HTML pages under ../public (dashboard-b, -c, -d).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/LunaV2.0/dashboard-a/',
  resolve: {
    alias: { '@tanstack/react-router': fileURLToPath(new URL('./src/router-stub.ts', import.meta.url)) },
  },
  build: {
    outDir: '../dist/dashboard-a',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./index-a.html', import.meta.url)),
    },
  },
})
