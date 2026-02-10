// Shared core constants for profiles and permissions (runtime only).
// TypeScript helper types live in a separate .ts file if needed.

export const PROFILE_IDS = {
  AGENT: "agent-agence",
  MANAGER: "manager-agence",
  ANALYST: "analyste-audit",
  ADMIN: "admin-backoffice",
  SUPER_ADMIN: "super-admin",
};

export const PERMISSIONS = {
  ACCOUNTS_VIEW: "accounts:view",
  ACCOUNTS_EDIT: "accounts:edit",
  TRANSACTIONS_VIEW: "transactions:view",
  AUDIT_VIEW: "audit:view",
  RBAC_MANAGE: "rbac:manage",
  ADMIN: "admin",
  REPORTS_VIEW: "reports:view",
  DASHBOARD_VIEW: "dashboard:view",
  SUPER_ADMIN: "super-admin",
};

