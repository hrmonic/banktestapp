import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import transactionsModule from '../../src/modules/transactions/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('transactions module', () => {
  it("rend la page d'accueil des transactions", () => {
    const RoutesComponent = transactionsModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Historique des transactions/i)
    ).toBeInTheDocument();
  });
});
