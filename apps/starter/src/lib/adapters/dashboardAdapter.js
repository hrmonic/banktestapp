// Demo adapter for dashboard KPIs and widgets.
// In a real app this would call your backend; here we return static data.

export async function getKpis() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    totalBalance: 125_430_000,
    activeAccounts: 48210,
    incidentRate: 0.02,
    balanceTrend: 2.3, // % de variation
    accountsTrend: 0.8,
    incidentTrend: -5.2,
  };
}

export async function getAlerts() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: "alert-1",
      type: "incident",
      title: "Pic d'incidents cartes",
      description: "Taux d'échec supérieur à 3% sur la région Île-de-France.",
    },
    {
      id: "alert-2",
      type: "monitoring",
      title: "Surveillance virements sortants",
      description: "Hausse inhabituelle des virements > 50k€ sur les 24h.",
    },
  ];
}

/**
 * Retourne l'historique des encours sur 7 jours pour le graphique.
 */
export async function getBalanceHistory() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
      value: 125_000_000 + Math.random() * 1_000_000 - 500_000,
    });
  }
  return days;
}

/**
 * Retourne les transactions par type pour le graphique en barres.
 */
export async function getTransactionsByType() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { label: "Carte", value: 1240 },
    { label: "Virement", value: 890 },
    { label: "Prélèvement", value: 650 },
    { label: "Chèque", value: 120 },
  ];
}

/**
 * Retourne les événements récents pour la timeline d'activité.
 */
export async function getRecentActivity() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return [
    {
      id: "act-1",
      type: "account",
      icon: "🏦",
      title: "Nouveau compte créé",
      description: "Compte ACC-0004 pour Martin Sophie",
      time: "Il y a 12 min",
      link: "/accounts/ACC-0004",
    },
    {
      id: "act-2",
      type: "transaction",
      icon: "💳",
      title: "Transaction importante",
      description: "Virement de 25 000 € sur ACC-0002",
      time: "Il y a 1h",
      link: "/transactions",
    },
    {
      id: "act-3",
      type: "approval",
      icon: "✅",
      title: "Demande approuvée",
      description: "Augmentation plafond carte pour Dupont Marie",
      time: "Il y a 2h",
      link: "/approvals",
    },
    {
      id: "act-4",
      type: "audit",
      icon: "🔍",
      title: "Consultation compte",
      description: "Analyste audit a consulté ACC-0003",
      time: "Il y a 3h",
      link: "/audit",
    },
    {
      id: "act-5",
      type: "report",
      icon: "📊",
      title: "Rapport généré",
      description: "Rapport mensuel agence exporté",
      time: "Il y a 5h",
      link: "/reports",
    },
  ];
}


