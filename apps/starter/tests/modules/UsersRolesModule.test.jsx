import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import usersRolesModule from "../../src/modules/users-roles/module.js";

describe("users-roles module", () => {
  it("rend la page d'accueil Users & Roles", () => {
    const RoutesComponent = usersRolesModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Utilisateurs et rôles/i),
    ).toBeInTheDocument();
  });
});

