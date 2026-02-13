import '@testing-library/jest-dom';
import '../src/lib/i18n';
import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll } from 'vitest';

declare global {
  interface Window {
    __vite_plugin_react_preamble_installed__?: boolean;
  }
}

// Évite l'erreur "@vitejs/plugin-react can't detect preamble" en environnement test
if (typeof window !== 'undefined') {
  window.__vite_plugin_react_preamble_installed__ = true;
}

// Serveur MSW global pour les tests Vitest.
// Les handlers spécifiques peuvent être ajoutés dans chaque fichier de test via server.use.
export const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
