import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config pour l'app starter déployée sur GitHub Pages.
// L'app est servie sous https://hrmonic.github.io/banktestapp/
export default defineConfig({
  base: '/banktestapp/',
  plugins: [react()],
  optimizeDeps: {
    // lucide-react pose parfois problème au pré-bundle, on l'exclut.
    exclude: ['lucide-react'],
  },
});

