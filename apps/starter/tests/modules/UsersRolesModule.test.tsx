import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import usersRolesModule from '../../src/modules/users-roles/module';
import { ConfigProvider } from '../../src/lib/config/ConfigContext';
import { testClientConfig } from '../testConfig';

describe('users-roles module', () => {
  it("rend la page d'accueil Users & Roles", () => {
    const RoutesComponent = usersRolesModule.routes;

    render(
      <BrowserRouter>
        <ConfigProvider initialConfig={testClientConfig}>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Utilisateurs et rôles/i)).toBeInTheDocument();
  });
});
