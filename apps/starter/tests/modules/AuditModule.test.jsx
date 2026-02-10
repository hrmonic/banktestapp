import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import auditModule from "../../src/modules/audit/module.js";

describe("audit module", () => {
  it("rend la page d'accueil d'audit", () => {
    const RoutesComponent = auditModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText(/Journal d'audit/i)).toBeInTheDocument();
  });
});

