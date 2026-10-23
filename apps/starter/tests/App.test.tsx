import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { AuthProvider } from '../src/lib/auth/authProvider';
import { PermissionsProvider } from '../src/lib/security/rbac';

vi.mock('../src/lib/useClientConfig', () => ({
  useClientConfig: () => ({
    config: {
      modules: {
        dashboard: { enabled: true },
        transactions: { enabled: true },
      },
    },
    isLoading: false,
    error: null,
  }),
}));

describe('App', () => {
  it("rend au moins l'écran de chargement/config sans crash", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PermissionsProvider>
            <App />
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(
      screen.getByText(
        (content) =>
          content.includes('Chargement') && content.includes('bancaire')
      )
    ).toBeInTheDocument();
  });
});
