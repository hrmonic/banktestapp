/**
 * Profils métier de démo et permissions associées.
 *
 * En production, la vérité viendrait d'un backend / IDP.
 */
import {
  PROFILE_IDS,
  PERMISSIONS,
  type Permission,
} from '../../core/constants';

export { PROFILE_IDS };

const PROFILE_PERMISSIONS: Record<string, Permission[]> = {
  [PROFILE_IDS.AGENT]: [PERMISSIONS.ACCOUNTS_VIEW, PERMISSIONS.DASHBOARD_VIEW],
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

/** Profils reconnus (clés de PROFILE_PERMISSIONS). En démo, tout autre valeur ne reçoit aucune permission. */
const KNOWN_PROFILES = new Set<string>(Object.keys(PROFILE_PERMISSIONS));

/**
 * Retourne la liste de permissions pour un profil de démo.
 * Un profil inconnu, null ou vide reçoit des permissions vides (pas d'escalade vers ADMIN).
 */
export function getPermissionsForProfile(
  profile: string | undefined | null
): Permission[] {
  const p = typeof profile === 'string' ? profile.trim() : profile;
  if (p == null || p === '') return [];
  if (!KNOWN_PROFILES.has(p)) return [];
  return PROFILE_PERMISSIONS[p] ?? [];
}
