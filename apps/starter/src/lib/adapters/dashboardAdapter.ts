/**
 * Adaptateur de démo pour les KPIs et widgets du dashboard.
 * En production, remplacer par des appels à l’API (ex. via createApiClient).
 */
import type { ApiClient } from '../api/apiClient';

export type DashboardKpis = {
  totalBalance: number;
  activeAccounts: number;
  incidentRate: number;
  balanceTrend?: number;
  accountsTrend?: number;
  incidentTrend?: number;
};

export type DashboardAlert = {
  id: string;
  type: string;
  title: string;
  description: string;
};

export type BalanceHistoryPoint = {
  date: string;
  value: number;
};

export type TransactionsByTypeItem = {
  label: string;
  value: number;
};

export type RecentActivityItem = {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  link?: string;
};

/** Action suggérée pour le bloc « À faire maintenant » du dashboard. */
export type NextSuggestedAction = {
  id: string;
  label: string;
  description: string;
  /** Route vers laquelle naviguer (ex. /approvals, /audit). */
  to: string;
  /** Optionnel : ancre ou query (ex. #alertes). */
  fragment?: string;
};

const DEMO_KPIS: DashboardKpis = {
  totalBalance: 125_430_000,
  activeAccounts: 48210,
  incidentRate: 0.02,
  balanceTrend: 2.3,
  accountsTrend: 0.8,
  incidentTrend: -5.2,
};

export async function getKpis(
  api: ApiClient | null = null
): Promise<DashboardKpis> {
  if (api) return api.get<DashboardKpis>('/dashboard/kpis');
  await new Promise((resolve) => setTimeout(resolve, 300));
  return DEMO_KPIS;
}

export async function getAlerts(
  api: ApiClient | null = null
): Promise<DashboardAlert[]> {
  if (api) return api.get<DashboardAlert[]>('/dashboard/alerts');
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: 'alert-1',
      type: 'incident',
      title: "Pic d'incidents cartes",
      description: "Taux d'échec supérieur à 3% sur la région Île-de-France.",
    },
    {
      id: 'alert-2',
      type: 'monitoring',
      title: 'Surveillance virements sortants',
      description: 'Hausse inhabituelle des virements > 50k€ sur les 24h.',
    },
  ];
}

/**
 * Historique des encours sur 7 jours pour le graphique.
 */
export async function getBalanceHistory(
  api: ApiClient | null = null
): Promise<BalanceHistoryPoint[]> {
  if (api) return api.get<BalanceHistoryPoint[]>('/dashboard/balance-history');
  await new Promise((resolve) => setTimeout(resolve, 200));
  const today = new Date();
  const days: BalanceHistoryPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
      }),
      value: 125_000_000 + Math.random() * 1_000_000 - 500_000,
    });
  }
  return days;
}

/**
 * Transactions par type pour le graphique en barres.
 */
export async function getTransactionsByType(
  api: ApiClient | null = null
): Promise<TransactionsByTypeItem[]> {
  if (api)
    return api.get<TransactionsByTypeItem[]>('/dashboard/transactions-by-type');
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { label: 'Carte', value: 1240 },
    { label: 'Virement', value: 890 },
    { label: 'Prélèvement', value: 650 },
    { label: 'Chèque', value: 120 },
  ];
}

/**
 * Événements récents pour la timeline d’activité.
 */
export async function getRecentActivity(
  api: ApiClient | null = null
): Promise<RecentActivityItem[]> {
  if (api) return api.get<RecentActivityItem[]>('/dashboard/recent-activity');
  await new Promise((resolve) => setTimeout(resolve, 250));
  return [
    {
      id: 'act-1',
      type: 'account',
      icon: '🏦',
      title: 'Nouveau compte créé',
      description: 'Compte ACC-0004 pour Martin Sophie',
      time: 'Il y a 12 min',
      link: '/accounts/ACC-0004',
    },
    {
      id: 'act-2',
      type: 'transaction',
      icon: '💳',
      title: 'Transaction importante',
      description: 'Virement de 25 000 € sur ACC-0002',
      time: 'Il y a 1h',
      link: '/transactions',
    },
    {
      id: 'act-3',
      type: 'approval',
      icon: '✅',
      title: 'Demande approuvée',
      description: 'Augmentation plafond carte pour Dupont Marie',
      time: 'Il y a 2h',
      link: '/approvals',
    },
    {
      id: 'act-4',
      type: 'audit',
      icon: '🔍',
      title: 'Consultation compte',
      description: 'Analyste audit a consulté ACC-0003',
      time: 'Il y a 3h',
      link: '/audit',
    },
    {
      id: 'act-5',
      type: 'report',
      icon: '📊',
      title: 'Rapport généré',
      description: 'Rapport mensuel agence exporté',
      time: 'Il y a 5h',
      link: '/reports',
    },
  ];
}

/**
 * Prochaines actions suggérées (à faire maintenant).
 * En prod : GET /dashboard/next-actions. En démo : dérivé des alertes et de l’activité récente.
 */
export async function getNextSuggestedActions(
  api: ApiClient | null,
  opts: { alerts: DashboardAlert[]; recentActivity: RecentActivityItem[] }
): Promise<NextSuggestedAction[]> {
  if (api) {
    try {
      const list = await api.get<NextSuggestedAction[]>(
        '/dashboard/next-actions'
      );
      return Array.isArray(list) ? list : [];
    } catch {
      return buildDemoNextActions(opts);
    }
  }
  return buildDemoNextActions(opts);
}

function buildDemoNextActions(opts: {
  alerts: DashboardAlert[];
  recentActivity: RecentActivityItem[];
}): NextSuggestedAction[] {
  const actions: NextSuggestedAction[] = [];
  if (opts.alerts.length > 0) {
    actions.push({
      id: 'next-alerts',
      label: 'Consulter les alertes opérationnelles',
      description: opts.alerts[0].title,
      to: '/dashboard',
      fragment: 'alertes',
    });
  }
  const approvalActivity = opts.recentActivity.find(
    (a) => a.type === 'approval' || a.link?.includes('approvals')
  );
  if (approvalActivity) {
    actions.push({
      id: 'next-approvals',
      label: 'Traiter les approbations en attente',
      description: "Voir et traiter les demandes d'approbation.",
      to: '/approvals',
    });
  }
  if (
    actions.length === 0 &&
    opts.recentActivity.length > 0 &&
    opts.recentActivity[0].link
  ) {
    actions.push({
      id: 'next-activity',
      label: 'Voir la dernière activité',
      description: opts.recentActivity[0].title,
      to: opts.recentActivity[0].link,
    });
  }
  if (actions.length === 0) {
    actions.push({
      id: 'next-audit',
      label: "Consulter le journal d'audit",
      description: 'Voir les derniers événements enregistrés.',
      to: '/audit',
    });
  }
  return actions.slice(0, 3);
}
