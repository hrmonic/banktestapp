import React from "react";
import { Routes, Route } from "react-router-dom";

function AccountsHome() {
  return <div className="p-6">👤 Accounts (stub)</div>;
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
