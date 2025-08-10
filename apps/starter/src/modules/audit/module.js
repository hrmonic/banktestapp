import React from "react";
import { Routes, Route } from "react-router-dom";

function AuditHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Journal d'audit</h1>
      <p>Cette page affiche les journaux d'audit et les traces des actions effectuées. Les données seront chargées via votre API.</p>
    </div>
  );
}

function AuditRoutes() {
  return (
    <Routes>
      <Route index element={<AuditHome />} />
    </Routes>
  );
}

export default {
  id: "audit",
  name: "Audit",
  basePath: "/audit",
  routes: AuditRoutes,
  sidebarItems: [
    { label: "Audit", to: "/audit" }
  ],
};
