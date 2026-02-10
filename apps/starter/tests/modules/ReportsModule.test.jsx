import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import reportsModule from "../../src/modules/reports/module.js";

describe("reports module", () => {
  it("rend la page d'accueil des rapports", () => {
    const RoutesComponent = reportsModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Rapports/i }),
    ).toBeInTheDocument();
  });
});

