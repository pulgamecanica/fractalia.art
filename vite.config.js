import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      'fractal-engine': path.resolve(__dirname, 'fractal-engine/pkg/fractal_engine.js'),
    },
  },
  optimizeDeps: {
    exclude: ['fractal-engine'],
  },
})
