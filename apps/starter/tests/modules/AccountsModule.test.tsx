import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../setup';
import { accountHandlers } from '../msw/handlers';
import accountsModule from '../../src/modules/accounts/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('accounts module', () => {
  it('rend la page de liste des comptes', async () => {
    server.use(...accountHandlers);
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

    await waitFor(() => {
      expect(
        screen.queryByText(/Chargement des comptes/i)
      ).not.toBeInTheDocument();
    });
  });
});
