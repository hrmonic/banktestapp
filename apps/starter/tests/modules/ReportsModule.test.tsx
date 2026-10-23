import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import reportsModule from '../../src/modules/reports/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('reports module', () => {
  it("rend la page d'accueil des rapports", async () => {
    const RoutesComponent = reportsModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Rapports/i })
      ).toBeInTheDocument();
    });
  });
});
