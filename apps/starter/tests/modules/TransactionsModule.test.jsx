import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import transactionsModule from "../../src/modules/transactions/module.js";

describe("transactions module", () => {
  it("rend la page d'accueil des transactions", () => {
    const RoutesComponent = transactionsModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Historique des transactions/i)
    ).toBeInTheDocument();
  });
});


