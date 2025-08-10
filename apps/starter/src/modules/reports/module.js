import React from "react";
import { Routes, Route } from "react-router-dom";

function ReportsHome() {
  return <div className="p-6">\ud83d\udcc8 Reports (stub)</div>;
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
