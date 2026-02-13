/**
 * Hook de chargement des données du dashboard.
 * Centralise la logique async, l’état d’erreur et le cleanup (pas de spaghetti dans le composant).
 */
import { useCallback, useEffect, useState } from 'react';
import type { ApiClient } from '../../lib/api/apiClient';
import {
  getKpis,
  getAlerts,
  getBalanceHistory,
  getTransactionsByType,
  getRecentActivity,
  getNextSuggestedActions,
} from '../../lib/adapters/dashboardAdapter';
import type {
  BalanceHistoryPoint,
  NextSuggestedAction,
} from '../../lib/adapters/dashboardAdapter';
import type {
  DashboardKpis,
  DashboardAlert,
  DashboardRecentActivityItem,
  DashboardTransactionsByTypeItem,
} from './types';

export type DashboardData = {
  kpis: DashboardKpis | null;
  alerts: DashboardAlert[];
  balanceHistory: BalanceHistoryPoint[];
  transactionsByType: DashboardTransactionsByTypeItem[];
  recentActivity: DashboardRecentActivityItem[];
  nextSuggestedActions: NextSuggestedAction[];
};

const DEFAULT_DATA: DashboardData = {
  kpis: null,
  alerts: [],
  balanceHistory: [],
  transactionsByType: [],
  recentActivity: [],
  nextSuggestedActions: [],
};

export function useDashboardData(api: ApiClient | null = null): {
  data: DashboardData;
  loadError: string | null;
  loadData: () => () => void;
} {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback((): (() => void) => {
    setLoadError(null);
    let cancelled = false;
    (async () => {
      try {
        const [
          kpiData,
          alertsData,
          historyData,
          transactionsData,
          activityData,
        ] = await Promise.all([
          getKpis(api),
          getAlerts(api),
          getBalanceHistory(api),
          getTransactionsByType(api),
          getRecentActivity(api),
        ]);
        if (cancelled) return;
        const nextSuggestedActions = await getNextSuggestedActions(api, {
          alerts: alertsData,
          recentActivity: activityData,
        });
        if (!cancelled) {
          setData({
            kpis: kpiData,
            alerts: alertsData,
            balanceHistory: historyData,
            transactionsByType: transactionsData,
            recentActivity: activityData,
            nextSuggestedActions,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : 'Erreur lors du chargement du tableau de bord.'
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  useEffect(() => {
    return loadData();
  }, [loadData]);

  return { data, loadError, loadData };
}
