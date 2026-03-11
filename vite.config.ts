import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Chemin de base pour GitHub Pages : https://hrmonic.github.io/banktestapp/
  // En local (dev), Vite gère ce base path sans config supplémentaire.
  base: '/banktestapp/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
