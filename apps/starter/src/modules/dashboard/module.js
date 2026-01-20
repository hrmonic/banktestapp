import React from "react";
import { Routes, Route } from "react-router-dom";

/**
 * Page d’accueil du module Dashboard.
 * Exemple de module conforme au contrat BankModule.
 */
function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      <p>Bienvenue sur le tableau de bord de l’application. Cette page affichera des statistiques et des informations générales.</p>
    </div>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const dashboardModule = {
  id: "dashboard",
  name: "Dashboard",
  basePath: "/dashboard",
  routes: DashboardRoutes,
  sidebarItems: [
    { label: "Dashboard", to: "/dashboard" }
  ],
};

export default dashboardModule;
