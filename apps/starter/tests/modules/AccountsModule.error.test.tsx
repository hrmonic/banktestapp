/**
 * Test du chemin d'erreur : quand listAccounts rejette, la liste affiche
 * un message d'erreur et un bouton Réessayer (audit qualité code).
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import accountsModule from '../../src/modules/accounts/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

vi.mock('../../src/lib/adapters/accountsAdapter', () => ({
  listAccounts: vi.fn().mockRejectedValue(new Error('Réseau indisponible')),
  getAccountById: vi.fn().mockResolvedValue(null),
}));

describe('accounts module – chemin erreur liste', () => {
  it('affiche erreur et bouton Réessayer quand le chargement de la liste échoue', async () => {
    const RoutesComponent = accountsModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Gestion des comptes/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /Réessayer/i })
        ).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    expect(screen.getByText(/Réseau indisponible/i)).toBeInTheDocument();
  });
});
