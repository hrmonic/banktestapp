import React from "react";
import { Routes, Route } from "react-router-dom";
import { Card, Button } from "@bank/ui";

const DEMO_REPORTS = [
  {
    id: "RPT-001",
    name: "Rapport mensuel agence",
    description: "Volumes, encours et incidents par agence.",
    format: "PDF",
  },
  {
    id: "RPT-002",
    name: "Rapport incidents cartes",
    description: "Taux d’échec et incidents par canal carte.",
    format: "XLSX",
  },
  {
    id: "RPT-003",
    name: "Rapport conformité KYC",
    description: "Dossiers en anomalie et niveau de risque.",
    format: "PDF",
  },
];

function ReportsHome() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">Rapports</h1>
        <p className="text-sm text-slate-600">
          Catalogue de rapports financiers et opérationnels. Les boutons ci-dessous
          simulent la génération et le téléchargement.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {DEMO_REPORTS.map((report) => (
          <Card key={report.id}>
            <p className="text-xs font-mono text-slate-500 mb-1">
              {report.id}
            </p>
            <h2 className="text-sm font-semibold">{report.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{report.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              Format : {report.format}
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" disabled>
                Générer
              </Button>
              <Button size="sm" variant="secondary" disabled>
                Télécharger
              </Button>
            </div>
          </Card>
        ))}
      </div>
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

/** @type {import("../types.d.js").BankModule} */
const reportsModule = {
  id: "reports",
  name: "Reports",
  basePath: "/reports",
  routes: ReportsRoutes,
  sidebarItems: [{ label: "Reports", to: "/reports", order: 4 }],
  permissionsRequired: ["reports:view"],
};

export default reportsModule;
