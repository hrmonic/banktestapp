import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import accountsModule from "../../src/modules/accounts/module.js";

describe("accounts module", () => {
  it("rend la page de liste des comptes", () => {
    const RoutesComponent = accountsModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Gestion des comptes/i)
    ).toBeInTheDocument();
  });
});


