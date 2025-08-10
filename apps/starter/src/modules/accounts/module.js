import React from "react";
import { Routes, Route } from "react-router-dom";

function AccountsHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des comptes</h1>
      <p>Cette page permet de lister, consulter et modifier les comptes bancaires. Les données seront chargées via votre API.</p>
    </div>
  );
}

function AccountsRoutes() {
  return (
    <Routes>
      <Route index element={<AccountsHome />} />
    </Routes>
  );
}

export default {
  id: "accounts",
  name: "Accounts",
  basePath: "/accounts",
  routes: AccountsRoutes,
  sidebarItems: [
    { label: "Accounts", to: "/accounts" }
  ],
};
