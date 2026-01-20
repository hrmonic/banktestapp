import React from "react";
import { Routes, Route } from "react-router-dom";

function UsersRolesHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Utilisateurs et rôles</h1>
      <p>Cette page permet de gérer les utilisateurs et leurs rôles. Les données seront chargées via votre API.</p>
    </div>
  );
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
