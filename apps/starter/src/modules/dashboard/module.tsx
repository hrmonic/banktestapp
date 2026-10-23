/**
 * Module Dashboard : tableau de bord avec KPIs, alertes et activité récente.
 * Données : useDashboardData. Contenu par rôle : roleCopy + DashboardRoleBlock.
 * P0 : bloc « À faire maintenant » (actions suggérées).
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link } from 'react-router-dom';
import { Card, Button } from '@bank/ui';
import { usePerfMetrics } from '../../lib/perf/usePerfMetrics';
import { useAuth } from '../../lib/auth/authProvider';
import { MiniLineChart } from '../../components/charts/MiniLineChart';
import { MiniBarChart } from '../../components/charts/MiniBarChart';
import { TrendIndicator } from '../../components/charts/TrendIndicator';
import { ModuleLoadingFallback } from '../../components/ModuleLoadingFallback';
import { getActiveRole } from './roleCopy';
import { useApiClient } from '../../lib/api/useApiClient';
import { useDashboardData } from './useDashboardData';
import { DashboardRoleBlock } from './DashboardRoleBlock';
import { EmptyState } from '../../components/EmptyState';
import type { BankModule } from '../../core/types';

function DashboardHome(): React.ReactElement {
  const { t } = useTranslation();
  const { user } = useAuth();
  usePerfMetrics('dashboard');
  const api = useApiClient();
  const { data, loadError, loadData } = useDashboardData(api);
  const activeRole = getActiveRole(user?.profile);
  const {
    kpis,
    alerts,
    balanceHistory,
    transactionsByType,
    recentActivity,
    nextSuggestedActions,
  } = data;

  if (loadError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Card
          variant="error"
          title="Erreur de chargement"
          description={loadError}
        >
          <Button type="button" variant="primary" onClick={() => loadData()}>
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
          <p className="text-sm text-slate-600">
            Vue d'ensemble des principaux indicateurs de la banque (données de
            démo, aucune opération réelle n'est exécutée).
          </p>
        </div>
        <DashboardRoleBlock role={activeRole} />
      </header>

      {nextSuggestedActions.length > 0 && (
        <section
          aria-live="polite"
          aria-label={t('dashboard.nextActionsSubtitle')}
        >
          <Card className="shadow-sm border-slate-200 dark:border-cursor-border dark:bg-cursor-surface">
            <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-cursor-text">
              {t('dashboard.nextActionsTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-cursor-text-muted mb-4">
              {nextSuggestedActions[0].description}
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                to={
                  nextSuggestedActions[0].fragment
                    ? `${nextSuggestedActions[0].to}#${nextSuggestedActions[0].fragment}`
                    : nextSuggestedActions[0].to
                }
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-cursor-border dark:bg-cursor-surface dark:text-cursor-text dark:hover:bg-cursor-border"
              >
                {nextSuggestedActions[0].label}
              </Link>
              {nextSuggestedActions.slice(1).map((action) => (
                <Link
                  key={action.id}
                  to={
                    action.fragment
                      ? `${action.to}#${action.fragment}`
                      : action.to
                  }
                  className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-cursor-text-muted dark:hover:text-cursor-text"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Encours total
            </p>
            {kpis?.balanceTrend != null && (
              <TrendIndicator value={kpis.balanceTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? kpis.totalBalance.toLocaleString('fr-FR') + ' €' : '…'}
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
            {kpis?.accountsTrend != null && (
              <TrendIndicator value={kpis.accountsTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? kpis.activeAccounts.toLocaleString('fr-FR') : '…'}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Sur les 7 derniers jours
          </p>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Taux d'incident cartes
            </p>
            {kpis?.incidentTrend != null && (
              <TrendIndicator value={kpis.incidentTrend} />
            )}
          </div>
          <p className="mt-2 text-2xl font-bold">
            {kpis ? `${(kpis.incidentRate * 100).toFixed(2)} %` : '…'}
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
            <EmptyState
              message="Aucune activité récente. Tout est à jour."
              actionLabel="Voir le journal d'audit"
              actionTo="/audit"
            />
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
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
            <ModuleLoadingFallback message="Chargement des données…" />
          ) : (
            <div className="space-y-3">
              {transactionsByType.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: '#10b981' }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {item.value.toLocaleString('fr-FR')}
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
              <EmptyState
                message="Aucune alerte active. Tout est sous contrôle."
                actionLabel="Voir le tableau de bord"
                actionTo="/dashboard"
              />
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

function DashboardRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
    </Routes>
  );
}

const dashboardModule: BankModule = {
  id: 'dashboard',
  name: 'Dashboard',
  basePath: '/dashboard',
  routes: DashboardRoutes,
  sidebarItems: [{ label: 'Dashboard', to: '/dashboard', order: 0 }],
};

export default dashboardModule;
