import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { AuthProvider } from "../src/lib/auth/authProvider.js";
import { PermissionsProvider } from "../src/lib/security/rbac.js";

vi.mock("../src/lib/useClientConfig.js", () => ({
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

describe("App", () => {
  it("rend au moins la route de login sans crash", () => {
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
      screen.getByRole("heading", { name: /connexion/i })
    ).toBeInTheDocument();
  });
});

