/**
 * Profils métier de démo et permissions associées.
 *
 * Ces permissions sont purement front (strings) et servent à
 * illustrer le RBAC modulaire. En production, la vérité viendrait
 * d'un backend / IDP.
 */
import { PROFILE_IDS, PERMISSIONS } from "../../core/constants.js";

export { PROFILE_IDS };

/** @type {Record<string, string[]>} */
const PROFILE_PERMISSIONS = {
  [PROFILE_IDS.AGENT]: [
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  [PROFILE_IDS.MANAGER]: [
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [PROFILE_IDS.ANALYST]: [
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  [PROFILE_IDS.ADMIN]: [
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.RBAC_MANAGE,
    PERMISSIONS.ADMIN,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  [PROFILE_IDS.SUPER_ADMIN]: [
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_EDIT,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.RBAC_MANAGE,
    PERMISSIONS.ADMIN,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SUPER_ADMIN,
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


