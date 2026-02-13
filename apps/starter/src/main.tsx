/**
 * Point d'entrée de l'application.
 * Config chargée une fois, puis choix du provider d'auth (démo vs OIDC).
 */
import './lib/i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from '@/lib/config/ConfigContext';
import { ConfigGate } from '@/lib/config/ConfigGate';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
    >
      Aller au contenu principal
    </a>
    <BrowserRouter>
      <ConfigProvider>
        <ConfigGate />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
