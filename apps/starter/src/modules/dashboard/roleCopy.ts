/**
 * Textes et actions par rôle pour le bloc "Mon rôle" du dashboard.
 * Séparation contenu / présentation : un seul endroit pour modifier les libellés.
 */
import { PROFILE_IDS } from '../../lib/security/profilePermissions';

export type RoleAction = { label: string; to: string };

export type RoleCopy = {
  title: string;
  description: string;
  actions: RoleAction[];
};

const DEFAULT_ROLE: RoleCopy = {
  title: 'Profil générique',
  description:
    'Explorez les modules du backoffice de démo pour découvrir les capacités de la plateforme.',
  actions: [{ label: 'Voir les comptes', to: '/accounts' }],
};

export const ROLE_COPY: Record<string, RoleCopy> = {
  [PROFILE_IDS.AGENT]: {
    title: "Agent d'agence",
    description:
      'Suivez vos portefeuilles clients, consultez les comptes et répondez rapidement aux demandes.',
    actions: [
      { label: 'Voir les comptes clients', to: '/accounts' },
      { label: 'Transactions récentes', to: '/transactions' },
    ],
  },
  [PROFILE_IDS.MANAGER]: {
    title: "Manager d'agence",
    description:
      "Pilotez l'activité de votre agence, surveillez les volumes et identifiez les points de vigilance.",
    actions: [
      { label: 'Performance agence', to: '/dashboard' },
      { label: 'Transactions', to: '/transactions' },
      { label: 'Rapports', to: '/reports' },
    ],
  },
  [PROFILE_IDS.ANALYST]: {
    title: 'Analyste audit',
    description:
      'Analysez les risques, incidents et anomalies opérationnelles pour sécuriser la banque.',
    actions: [
      { label: "Journal d'audit", to: '/audit' },
      { label: 'Transactions', to: '/transactions' },
      { label: 'Rapports de conformité', to: '/reports' },
    ],
  },
  [PROFILE_IDS.ADMIN]: {
    title: 'Admin backoffice',
    description:
      'Supervisez la plateforme, les droits des utilisateurs et la cohérence des modules métier.',
    actions: [
      { label: 'Utilisateurs & rôles', to: '/users-roles' },
      { label: 'Comptes', to: '/accounts' },
      { label: 'Audit', to: '/audit' },
    ],
  },
};

export function getActiveRole(profile: string | undefined): RoleCopy {
  if (profile != null && profile in ROLE_COPY) {
    return ROLE_COPY[profile];
  }
  return DEFAULT_ROLE;
}
