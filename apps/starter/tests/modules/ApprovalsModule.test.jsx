import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import approvalsModule from "../../src/modules/approvals/module.js";

describe("approvals module", () => {
  it("rend la page d'accueil des validations", () => {
    const RoutesComponent = approvalsModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Demandes d’approbation/i }),
    ).toBeInTheDocument();
  });
});

