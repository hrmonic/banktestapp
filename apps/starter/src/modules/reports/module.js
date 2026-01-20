import React from "react";
import { Routes, Route } from "react-router-dom";

function ReportsHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rapports</h1>
      <p>Cette page permet de générer et consulter les rapports financiers. Les données seront chargées via votre API.</p>
    </div>
  );
}

function ReportsRoutes() {
  return (
    <Routes>
      <Route index element={<ReportsHome />} />
    </Routes>
  );
}

export default {
  id: "reports",
  name: "Reports",
  basePath: "/reports",
  routes: ReportsRoutes,
  sidebarItems: [
    { label: "Reports", to: "/reports" }
  ],
};
