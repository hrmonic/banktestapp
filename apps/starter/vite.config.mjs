import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@bank/ui': resolve(__dirname, '../../packages/ui/src/index.tsx'),
    },
  },
  server: { port: 5173, host: true },
  /**
   * Par défaut Vite utilise les loaders esbuild adaptés (.ts, .tsx, .js, .jsx).
   * Ne pas forcer un loader unique pour tout le src afin que .ts/.tsx soient
   * compilés en TypeScript. Les fichiers .js contenant du JSX doivent être
   * en .jsx ou .tsx (migration vers 100 % TS).
   */
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', 'zod'],
          i18n: ['i18next', 'react-i18next'],
          ui: ['@bank/ui'],
        },
      },
    },
  },
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) },
  optimizeDeps: { include: ['@bank/ui'] },
});
