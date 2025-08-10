import React from "react";
import { Routes, Route } from "react-router-dom";

function ApprovalsHome() {
  return <div className="p-6">\u2705 Approvals (stub)</div>;
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
