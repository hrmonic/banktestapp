import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "@bank/ui";

const DEMO_TRANSACTIONS = [
  {
    id: "TRX-001",
    date: "2026-01-18 10:32",
    accountId: "ACC-0001",
    type: "Carte",
    amount: -54.9,
    currency: "EUR",
    status: "Confirmée",
  },
  {
    id: "TRX-002",
    date: "2026-01-18 11:05",
    accountId: "ACC-0002",
    type: "Virement sortant",
    amount: -12500,
    currency: "EUR",
    status: "En attente",
  },
  {
    id: "TRX-003",
    date: "2026-01-18 11:47",
    accountId: "ACC-0003",
    type: "Virement entrant",
    amount: 3200,
    currency: "EUR",
    status: "Confirmée",
  },
];

function TransactionsHome() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (!cancelled) {
        setTransactions(DEMO_TRANSACTIONS);
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
        <h1 className="text-2xl font-bold mb-1">Historique des transactions</h1>
        <p className="text-sm text-slate-600">
          Suivez les transactions récentes et leur statut. Données de
          démonstration, aucune opération réelle n’est exécutée.
        </p>
      </header>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600">Chargement des transactions…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Compte</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-right">Montant</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {trx.date}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">
                      {trx.accountId}
                    </td>
                    <td className="px-3 py-2">{trx.type}</td>
                    <td className="px-3 py-2 text-right">
                      {trx.amount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: trx.currency,
                      })}
                    </td>
                    <td className="px-3 py-2">{trx.status}</td>
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

function TransactionsRoutes() {
  return (
    <Routes>
      <Route index element={<TransactionsHome />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const transactionsModule = {
  id: "transactions",
  name: "Transactions",
  basePath: "/transactions",
  routes: TransactionsRoutes,
  sidebarItems: [{ label: "Transactions", to: "/transactions", order: 2 }],
  permissionsRequired: ["transactions:view"],
};

export default transactionsModule;
