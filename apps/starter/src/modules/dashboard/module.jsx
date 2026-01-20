import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Card, Button } from "@bank/ui";
import {
  getKpis,
  getAlerts,
  getBalanceHistory,
  getTransactionsByType,
  getRecentActivity,
} from "../../lib/adapters/dashboardAdapter.js";
import { useAuth } from "../../lib/auth/authProvider.js";
import { PROFILE_IDS } from "../../lib/security/profilePermissions.js";
import { MiniLineChart } from "../../components/charts/MiniLineChart.jsx";
import { MiniBarChart } from "../../components/charts/MiniBarChart.jsx";
import { TrendIndicator } from "../../components/charts/TrendIndicator.jsx";

/**
 * Page d’accueil du module Dashboard.
 * Affiche quelques KPIs et une liste d’alertes en données factices.
 */
function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [transactionsByType, setTransactionsByType] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const profile = user?.profile;

  const roleCopy = {
    [PROFILE_IDS.AGENT]: {
      title: "Agent d’agence",
      description:
        "Suivez vos portefeuilles clients, consultez les comptes et répondez rapidement aux demandes.",
      actions: [
        { label: "Voir les comptes clients", to: "/accounts" },
        { label: "Transactions récentes", to: "/transactions" },
      ],
    },
    [PROFILE_IDS.MANAGER]: {
      title: "Manager d’agence",
      description:
        "Pilotez l’activité de votre agence, surveillez les volumes et identifiez les points de vigilance.",
      actions: [
        { label: "Performance agence", to: "/dashboard" },
        { label: "Transactions", to: "/transactions" },
        { label: "Rapports", to: "/reports" },
      ],
    },
    [PROFILE_IDS.ANALYST]: {
      title: "Analyste audit",
      description:
        "Analysez les risques, incidents et anomalies opérationnelles pour sécuriser la banque.",
      actions: [
        { label: "Journal d’audit", to: "/audit" },
        { label: "Transactions", to: "/transactions" },
        { label: "Rapports de conformité", to: "/reports" },
      ],
    },
    [PROFILE_IDS.ADMIN]: {
      title: "Admin backoffice",
      description:
        "Supervisez la plateforme, les droits des utilisateurs et la cohérence des modules métier.",
      actions: [
        { label: "Utilisateurs & rôles", to: "/users-roles" },
        { label: "Comptes", to: "/accounts" },
        { label: "Audit", to: "/audit" },
      ],
    },
  };

  const activeRole = roleCopy[profile] || {
    title: "Profil générique",
    description:
      "Explorez les modules du backoffice de démo pour découvrir les capacités de la plateforme.",
    actions: [{ label: "Voir les comptes", to: "/accounts" }],
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [kpiData, alertsData, historyData, transactionsData, activityData] =
        await Promise.all([
          getKpis(),
          getAlerts(),
          getBalanceHistory(),
          getTransactionsByType(),
          getRecentActivity(),
        ]);
      if (!cancelled) {
        setKpis(kpiData);
        setAlerts(alertsData);
        setBalanceHistory(historyData);
        setTransactionsByType(transactionsData);
        setRecentActivity(activityData);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
          <p className="text-sm text-slate-600">
            Vue d’ensemble des principaux indicateurs de la banque (données de
            démo, aucune opération réelle n’est exécutée).
          </p>
        </div>
        <Card>
          <p className="text-xs font-semibold uppercase text-slate-500 mb-1">
            Mon rôle
          </p>
          <p className="text-sm font-semibold">{activeRole.title}</p>
          <p className="mt-1 text-sm text-slate-600">
            {activeRole.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeRole.actions.map((action) => (
              <Button
                key={action.to}
                size="sm"
                variant="secondary"
                onClick={() => navigate(action.to)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Encours total
            </p>
            {kpis && kpis.balanceTrend && (
              <TrendIndicator value={kpis.balanceTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? kpis.totalBalance.toLocaleString("fr-FR") + " €" : "…"}
          </p>
          {balanceHistory.length > 0 && (
            <div className="mt-4">
              <MiniLineChart data={balanceHistory} color="#3b82f6" />
            </div>
          )}
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Comptes actifs
            </p>
            {kpis && kpis.accountsTrend && (
              <TrendIndicator value={kpis.accountsTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? kpis.activeAccounts.toLocaleString("fr-FR") : "…"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Sur les 7 derniers jours
          </p>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Taux d’incident cartes
            </p>
            {kpis && kpis.incidentTrend && (
              <TrendIndicator value={kpis.incidentTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? `${(kpis.incidentRate * 100).toFixed(2)} %` : "…"}
          </p>
          {transactionsByType.length > 0 && (
            <div className="mt-4">
              <MiniBarChart data={transactionsByType} color="#10b981" />
            </div>
          )}
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Activité récente</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-600">
              Aucune activité récente à afficher.
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="flex-shrink-0 text-2xl leading-none">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                        {activity.time}
                      </span>
                    </div>
                    {activity.link && (
                      <Link
                        to={activity.link}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Voir les détails
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions par type</h2>
          {transactionsByType.length === 0 ? (
            <p className="text-sm text-slate-600">
              Chargement des données…
            </p>
          ) : (
            <div className="space-y-3">
              {transactionsByType.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: "#10b981" }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {item.value.toLocaleString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Alertes opérationnelles</h2>
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-600">
                Aucune alerte active pour le moment.
              </p>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id}>
                <p className="text-xs uppercase text-slate-500 mb-1">
                  {alert.type}
                </p>
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-slate-600">{alert.description}</p>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const dashboardModule = {
  id: "dashboard",
  name: "Dashboard",
  basePath: "/dashboard",
  routes: DashboardRoutes,
  sidebarItems: [{ label: "Dashboard", to: "/dashboard", order: 0 }],
};

export default dashboardModule;
