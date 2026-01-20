import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Card, Button } from "@bank/ui";

const DEMO_APPROVALS = [
  {
    id: "APP-001",
    type: "Augmentation plafond carte",
    requester: "Dupont Marie",
    amount: 5000,
    currency: "EUR",
    status: "En attente",
  },
  {
    id: "APP-002",
    type: "Ouverture compte entreprise",
    requester: "SAS TechFinance",
    amount: 0,
    currency: "EUR",
    status: "En attente",
  },
];

function ApprovalsHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (!cancelled) {
        setItems(DEMO_APPROVALS);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">Demandes d’approbation</h1>
        <p className="text-sm text-slate-600">
          Visualisez les demandes nécessitant une validation manuelle. Les
          actions ci-dessous sont purement démonstratives.
        </p>
      </header>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600">
            Chargement des demandes d’approbation…
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-600">
            Aucune demande en attente. Tout est à jour.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Demandeur</th>
                  <th className="px-3 py-2 text-right">Montant</th>
                  <th className="px-3 py-2">Statut</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                    <td className="px-3 py-2">{item.type}</td>
                    <td className="px-3 py-2">{item.requester}</td>
                    <td className="px-3 py-2 text-right">
                      {item.amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: item.currency,
                      })}
                    </td>
                    <td className="px-3 py-2">{item.status}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <Button size="sm" variant="secondary" disabled>
                        Approuver
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        Rejeter
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function ApprovalsRoutes() {
  return (
    <Routes>
      <Route index element={<ApprovalsHome />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const approvalsModule = {
  id: "approvals",
  name: "Approvals",
  basePath: "/approvals",
  routes: ApprovalsRoutes,
  sidebarItems: [{ label: "Approvals", to: "/approvals", order: 3 }],
  permissionsRequired: ["transactions:view"],
};

export default approvalsModule;
