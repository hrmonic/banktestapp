import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import dashboardModule from '../../src/modules/dashboard/module';
import { AuthProvider } from '../../src/lib/auth/authProvider';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('dashboard module', () => {
  it("rend la page d'accueil du dashboard", () => {
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

    expect(
      screen.getByRole('heading', { name: /Tableau de bord/i })
    ).toBeInTheDocument();
  });
});
