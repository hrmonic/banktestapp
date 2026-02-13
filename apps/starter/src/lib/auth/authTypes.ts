import type { ProfileId } from '../../core/constants';

/**
 * Représente l'utilisateur authentifié dans la démo.
 *
 * En production, ce type serait probablement enrichi (id interne, claims OIDC, etc.).
 */
export type AuthUser = {
  name: string;
  /**
   * Identifiant de profil RBAC (profil de démo).
   */
  profile: ProfileId | string;
  /**
   * Ensemble de rôles/permissions associés à l'utilisateur.
   * Dans la démo, on se contente d'un tableau de chaînes.
   */
  roles: string[];
};

/**
 * Valeur exposée par le contexte d'authentification.
 */
export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: unknown) => Promise<void>;
  logout: () => void;
  loading: boolean;
};
