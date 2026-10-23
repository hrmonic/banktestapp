/**
 * Indicateurs principaux du dashboard.
 */
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

export type DashboardRecentActivityItem = {
  id: string;
  type?: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  link?: string;
};

export type DashboardTransactionsByTypeItem = {
  label: string;
  value: number;
};
