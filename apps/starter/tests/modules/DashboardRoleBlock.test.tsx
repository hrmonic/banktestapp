import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../../src/lib/auth/authProvider';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { PROFILE_IDS } from '../../src/lib/security/profilePermissions';
import dashboardModule from '../../src/modules/dashboard/module';
import { testClientConfig } from '../testConfig';

function renderWithProfile(profile: string) {
  window.localStorage.setItem('demo-profile', profile);
  const RoutesComponent = dashboardModule.routes;

  return render(
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
}

describe('Dashboard role block', () => {
  it("affiche un rôle d'agent pour le profil agent-agence", () => {
    renderWithProfile(PROFILE_IDS.AGENT);
    expect(screen.getByText(/Mon rôle/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent/i)).toBeInTheDocument();
  });
});
