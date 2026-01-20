import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import dashboardModule from "../../src/modules/dashboard/module.js";

describe("dashboard module", () => {
  it("rend la page d'accueil du dashboard", () => {
    const RoutesComponent = dashboardModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Tableau de bord/i)
    ).toBeInTheDocument();
  });
});


