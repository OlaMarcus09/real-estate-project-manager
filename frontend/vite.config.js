import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel-specific configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Vercel optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      external: [],
    },
  },
  // Fix for esbuild issues on Vercel
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true
      },
    },
  },
  esbuild: {
    target: 'es2020'
  }
})
