/**
 * Test du chemin d'erreur : quand les adaptateurs rejettent, le dashboard
 * affiche un message d'erreur et un bouton Réessayer (audit qualité code).
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../src/lib/auth/authProvider';

vi.mock('../../src/lib/adapters/dashboardAdapter', () => ({
  getKpis: vi.fn().mockRejectedValue(new Error('Network error')),
  getAlerts: vi.fn().mockResolvedValue([]),
  getBalanceHistory: vi.fn().mockResolvedValue([]),
  getTransactionsByType: vi.fn().mockResolvedValue([]),
  getRecentActivity: vi.fn().mockResolvedValue([]),
}));

import dashboardModule from '../../src/modules/dashboard/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('dashboard module – chemin erreur', () => {
  it('affiche erreur et bouton Réessayer quand le chargement échoue', async () => {
    const RoutesComponent = dashboardModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<RoutesComponent />} />
            </Routes>
          </AuthProvider>
        </ConfigProvider>
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /Réessayer/i })
        ).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    expect(screen.getByText(/Erreur de chargement/i)).toBeInTheDocument();
  });
});
