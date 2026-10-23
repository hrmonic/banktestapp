// Constantes cœur partagées pour les profils et les permissions.
// Les valeurs sont miroir de la configuration RBAC de démo.

export const PROFILE_IDS = {
  AGENT: 'agent-agence',
  MANAGER: 'manager-agence',
  ANALYST: 'analyste-audit',
  ADMIN: 'admin-backoffice',
  SUPER_ADMIN: 'super-admin',
} as const;

export const PERMISSIONS = {
  ACCOUNTS_VIEW: 'accounts:view',
  ACCOUNTS_EDIT: 'accounts:edit',
  TRANSACTIONS_VIEW: 'transactions:view',
  AUDIT_VIEW: 'audit:view',
  RBAC_MANAGE: 'rbac:manage',
  ADMIN: 'admin',
  REPORTS_VIEW: 'reports:view',
  DASHBOARD_VIEW: 'dashboard:view',
  SUPER_ADMIN: 'super-admin',
} as const;

export type ProfileId = (typeof PROFILE_IDS)[keyof typeof PROFILE_IDS];

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
