import React from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "@bank/ui";

const DEMO_EVENTS = [
  {
    id: "EVT-001",
    at: "2026-01-18 09:12",
    actor: "admin-backoffice",
    action: "Changement de rôle",
    resource: "USR-003",
    details: "Rôle mis à jour de agent-agence vers analyste-audit.",
  },
  {
    id: "EVT-002",
    at: "2026-01-18 10:03",
    actor: "manager-agence",
    action: "Export rapport",
    resource: "RPT-001",
    details: "Rapport mensuel agence exporté au format PDF.",
  },
  {
    id: "EVT-003",
    at: "2026-01-18 10:45",
    actor: "analyste-audit",
    action: "Consultation compte",
    resource: "ACC-0003",
    details: "Consulte le détail du compte client.",
  },
];

function AuditHome() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">Journal d'audit</h1>
        <p className="text-sm text-slate-600">
          Trace des principales actions sensibles dans le backoffice. Les
          événements ci-dessous sont fournis à titre de démonstration.
        </p>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="px-3 py-2">Horodatage</th>
                <th className="px-3 py-2">Acteur</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Ressource</th>
                <th className="px-3 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_EVENTS.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {event.at}
                  </td>
                  <td className="px-3 py-2">{event.actor}</td>
                  <td className="px-3 py-2">{event.action}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {event.resource}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-700">
                    {event.details}
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

function AuditRoutes() {
  return (
    <Routes>
      <Route index element={<AuditHome />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const auditModule = {
  id: "audit",
  name: "Audit",
  basePath: "/audit",
  routes: AuditRoutes,
  sidebarItems: [{ label: "Audit", to: "/audit", order: 6 }],
  permissionsRequired: ["audit:view"],
};

export default auditModule;
