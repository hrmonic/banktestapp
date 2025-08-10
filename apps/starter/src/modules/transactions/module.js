import React from "react";
import { Routes, Route } from "react-router-dom";

function TransactionsHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historique des transactions</h1>
      <p>Cette page permet de consulter les transactions et leur statut. Les données seront chargées via votre API.</p>
    </div>
  );
}

function TransactionsRoutes() {
  return (
    <Routes>
      <Route index element={<TransactionsHome />} />
    </Routes>
  );
}

export default {
  id: "transactions",
  name: "Transactions",
  basePath: "/transactions",
  routes: TransactionsRoutes,
  sidebarItems: [
    { label: "Transactions", to: "/transactions" }
  ],
};
