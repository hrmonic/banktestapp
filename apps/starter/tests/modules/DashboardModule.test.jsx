import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import dashboardModule from "../../src/modules/dashboard/module.js";
import { AuthProvider } from "../../src/lib/auth/authProvider.jsx";

describe("dashboard module", () => {
  it("rend la page d'accueil du dashboard", () => {
    const RoutesComponent = dashboardModule.routes;

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<RoutesComponent />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Tableau de bord/i),
    ).toBeInTheDocument();
  });
});

