import React from "react";
import { Routes, Route } from "react-router-dom";

function DashboardHome() {
  return <div className="p-6">📊 Dashboard (stub)</div>;
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
    </Routes>
  );
}

export default {
  id: "dashboard",
  name: "Dashboard",
  basePath: "/dashboard",
  routes: DashboardRoutes,
  sidebarItems: [
    { label: "Dashboard", to: "/dashboard" }
  ],
};
