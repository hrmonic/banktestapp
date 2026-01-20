import React from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "@bank/ui";

const DEMO_USERS = [
  {
    id: "USR-001",
    name: "Camille Durand",
    email: "camille.durand@bank.test",
    role: "agent-agence",
  },
  {
    id: "USR-002",
    name: "Nicolas Leroy",
    email: "nicolas.leroy@bank.test",
    role: "manager-agence",
  },
  {
    id: "USR-003",
    name: "Alice Morel",
    email: "alice.morel@bank.test",
    role: "analyste-audit",
  },
  {
    id: "USR-004",
    name: "Admin Backoffice",
    email: "admin@bank.test",
    role: "admin-backoffice",
  },
];

function UsersRolesHome() {
  return (
    <div className="space-y-4">
      <header>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Utilisateurs et rôles</h1>
            <p className="text-sm text-slate-600">
              Vue de démonstration de la gestion des utilisateurs internes et
              de leurs profils d’accès.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
            Admin only
          </span>
        </div>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Profil</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-xs">{user.id}</td>
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {user.email}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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

/** @type {import("../types.d.js").BankModule} */
const usersRolesModule = {
  id: "users-roles",
  name: "Users & Roles",
  basePath: "/users-roles",
  routes: UsersRolesRoutes,
  sidebarItems: [{ label: "Users & Roles", to: "/users-roles", order: 5 }],
  permissionsRequired: ["admin", "rbac:manage"],
};

export default usersRolesModule;
