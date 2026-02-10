import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react({ include: /\.(jsx|tsx)$/, fastRefresh: false })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./apps/starter/tests/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{git,cache,output,vitest}/**',
      'apps/starter/tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '*.config.*'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/starter/src'),
      '@bank/ui': resolve(__dirname, './packages/ui/src'),
    },
  },
});