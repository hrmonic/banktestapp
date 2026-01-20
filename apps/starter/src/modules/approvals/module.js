import React from "react";
import { Routes, Route } from "react-router-dom";

function ApprovalsHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Demandes d’approbation</h1>
      <p>Cette page permet de gérer et approuver les demandes en attente. Les données seront chargées via votre API.</p>
    </div>
  );
}

function ApprovalsRoutes() {
  return (
    <Routes>
      <Route index element={<ApprovalsHome />} />
    </Routes>
  );
}

export default {
  id: "approvals",
  name: "Approvals",
  basePath: "/approvals",
  routes: ApprovalsRoutes,
  sidebarItems: [
    { label: "Approvals", to: "/approvals" }
  ],
};
