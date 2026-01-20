/**
 * Profils métier de démo et permissions associées.
 *
 * Ces permissions sont purement front (strings) et servent à
 * illustrer le RBAC modulaire. En production, la vérité viendrait
 * d'un backend / IDP.
 */

export const PROFILE_IDS = {
  AGENT: "agent-agence",
  MANAGER: "manager-agence",
  ANALYST: "analyste-audit",
  ADMIN: "admin-backoffice",
  SUPER_ADMIN: "super-admin",
};

/** @type {Record<string, string[]>} */
const PROFILE_PERMISSIONS = {
  [PROFILE_IDS.AGENT]: [
    "accounts:view",
    "dashboard:view",
  ],
  [PROFILE_IDS.MANAGER]: [
    "accounts:view",
    "accounts:edit",
    "transactions:view",
    "dashboard:view",
    "reports:view",
  ],
  [PROFILE_IDS.ANALYST]: [
    "transactions:view",
    "audit:view",
    "reports:view",
    "dashboard:view",
  ],
  [PROFILE_IDS.ADMIN]: [
    "accounts:view",
    "accounts:edit",
    "transactions:view",
    "audit:view",
    "rbac:manage",
    "admin",
    "reports:view",
    "dashboard:view",
  ],
  [PROFILE_IDS.SUPER_ADMIN]: [
    "accounts:view",
    "accounts:edit",
    "transactions:view",
    "audit:view",
    "rbac:manage",
    "admin",
    "reports:view",
    "dashboard:view",
    "super-admin",
  ],
};

/**
 * Retourne la liste de permissions (strings) pour un profil.
 *
 * @param {string | undefined | null} profile
 * @returns {string[]}
 */
export function getPermissionsForProfile(profile) {
  if (!profile) return PROFILE_PERMISSIONS[PROFILE_IDS.ADMIN];
  return PROFILE_PERMISSIONS[profile] ?? PROFILE_PERMISSIONS[PROFILE_IDS.ADMIN];
}


