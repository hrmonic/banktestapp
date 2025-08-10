import React from "react";
import { Routes, Route } from "react-router-dom";

function AuditHome() {
  return <div className="p-6">\ud83d\udd0e\uFE0F Audit (stub)</div>;
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
