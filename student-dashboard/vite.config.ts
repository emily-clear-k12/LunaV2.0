import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// Standalone build of Emily's Astra dashboard (src/routes/index.tsx).
// Served at https://emily-clear-k12.github.io/LunaV2.0/dashboard/ ; output lands in ../dist/dashboard.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/LunaV2.0/dashboard/',
  resolve: {
    // The route file imports createFileRoute; we render it without the router.
    alias: { '@tanstack/react-router': fileURLToPath(new URL('./src/router-stub.ts', import.meta.url)) },
  },
  build: { outDir: '../dist/dashboard', emptyOutDir: true },
})
