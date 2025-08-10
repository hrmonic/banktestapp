import React from "react";
import { Routes, Route } from "react-router-dom";

function UsersRolesHome() {
  return <div className="p-6">\ud83d\udc65 Users & Roles (stub)</div>;
}

function UsersRolesRoutes() {
  return (
    <Routes>
      <Route index element={<UsersRolesHome />} />
    </Routes>
  );
}

export default {
  id: "users-roles",
  name: "Users & Roles",
  basePath: "/users-roles",
  routes: UsersRolesRoutes,
  sidebarItems: [
    { label: "Users & Roles", to: "/users-roles" }
  ],
};
