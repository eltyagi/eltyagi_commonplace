import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ViteImageOptimizer({
      exclude: /\.svg$/,
      webp: { quality: 80 },
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      'buffer': 'buffer',
    }
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
