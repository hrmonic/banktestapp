import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../../src/lib/auth/authProvider.jsx";
import { PROFILE_IDS } from "../../src/lib/security/profilePermissions.js";
import dashboardModule from "../../src/modules/dashboard/module.js";

function renderWithProfile(profile) {
  window.localStorage.setItem("demo-profile", profile);
  const RoutesComponent = dashboardModule.routes;

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe("Dashboard role block", () => {
  it("affiche un rôle d’agent pour le profil agent-agence", () => {
    renderWithProfile(PROFILE_IDS.AGENT);
    expect(
      screen.getByText(/Agent d’agence/i)
    ).toBeInTheDocument();
  });
});


