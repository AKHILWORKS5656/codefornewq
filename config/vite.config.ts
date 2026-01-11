import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true, // Uses default esbuild, resolving the "terser not found" error
    rollupOptions: {
      output: {
        manualChunks: undefined // Removed manual chunking to prevent empty chunk warnings during deployment
      }
    }
  }
});