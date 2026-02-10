import "@testing-library/jest-dom";

// Évite l'erreur "@vitejs/plugin-react can't detect preamble" en environnement test
if (typeof window !== "undefined") {
  window.__vite_plugin_react_preamble_installed__ = true;
}

