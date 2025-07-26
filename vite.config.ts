// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ensures the correct path is used when hosted
  plugins: [react()],
  build: {
    outDir: 'dist', // This is the folder Render expects
    chunkSizeWarningLimit: 1000, // Optional: suppress chunk size warning
  },
});
