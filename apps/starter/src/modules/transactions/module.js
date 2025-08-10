import React from "react";
import { Routes, Route } from "react-router-dom";

function TransactionsHome() {
  return <div className="p-6">\ud83d\udcb8 Transactions (stub)</div>;
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
