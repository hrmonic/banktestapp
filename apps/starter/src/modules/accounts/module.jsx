import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Card, Button, VirtualizedList } from "@bank/ui";
import {
  listAccounts,
  getAccountById,
} from "../../lib/adapters/accountsAdapter.js";

function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await listAccounts();
      if (!cancelled) {
        setAccounts(data);
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
        <h1 className="text-2xl font-bold mb-1">Gestion des comptes</h1>
        <p className="text-sm text-slate-600">
          Liste de comptes de démo, pour illustrer la navigation et les
          écrans de détail.
        </p>
      </header>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-600">Chargement des comptes…</p>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-slate-600">
            Aucun compte à afficher pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <VirtualizedList
              items={accounts}
              itemHeight={56}
              overscan={5}
              className="max-h-[480px]"
              renderItem={(account) => (
                <table
                  key={account.id}
                  className="min-w-full text-sm border-b border-slate-100 last:border-0"
                >
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs text-slate-700">
                        {account.id}
                      </td>
                      <td className="px-3 py-2">{account.holder}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {account.iban}
                      </td>
                      <td className="px-3 py-2">{account.type}</td>
                      <td className="px-3 py-2">{account.status}</td>
                      <td className="px-3 py-2 text-right">
                        {account.balance.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: account.currency,
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/accounts/${account.id}`)}
                        >
                          Détails
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function AccountDetails() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getAccountById(accountId);
      if (!cancelled) {
        setAccount(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (loading) {
    return <p className="text-sm text-slate-600">Chargement du compte…</p>;
  }

  if (!account) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          Compte introuvable. Il s’agit probablement d’un identifiant de démo.
        </p>
        <Button variant="secondary" onClick={() => navigate("/accounts")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="secondary" onClick={() => navigate("/accounts")}>
        ← Retour à la liste
      </Button>
      <Card>
        <h1 className="text-xl font-bold mb-2">
          Compte {account.id} – {account.holder}
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          Détails du compte (données de démo, aucune action réelle).
        </p>
        <dl className="grid gap-2 md:grid-cols-2 text-sm">
          <div>
            <dt className="text-slate-500">IBAN</dt>
            <dd className="font-mono text-xs">{account.iban}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Type</dt>
            <dd>{account.type}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Statut</dt>
            <dd>{account.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Solde</dt>
            <dd>
              {account.balance.toLocaleString("fr-FR", {
                style: "currency",
                currency: account.currency,
              })}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

function AccountsRoutes() {
  return (
    <Routes>
      <Route index element={<AccountsList />} />
      <Route path=":accountId" element={<AccountDetails />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const accountsModule = {
  id: "accounts",
  name: "Accounts",
  basePath: "/accounts",
  routes: AccountsRoutes,
  sidebarItems: [{ label: "Accounts", to: "/accounts", order: 1 }],
  permissionsRequired: ["accounts:view"],
};

export default accountsModule;
