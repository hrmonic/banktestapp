/**
 * Valide la config client et expose les types dérivés.
 * À utiliser côté client pour s'assurer que la config chargée est cohérente.
 */
import { parseClientConfig } from '../configSchema';

export type ClientConfig = ReturnType<typeof parseClientConfig>;
export type BrandingConfig = ClientConfig['branding'];
export type ModulesConfig = ClientConfig['modules'];
export type ApiConfig = ClientConfig['api'];
export type AuthConfig = ClientConfig['auth'];
export type SessionConfig = ClientConfig['session'];

/** true si l'auth est en mode démo (profil localStorage, pas d'OIDC). */
export function isDemoAuth(config: ClientConfig): boolean {
  const auth = config.auth;
  if (!auth) return true;
  return 'mode' in auth ? auth.mode !== 'oidc' : true;
}

/**
 * Valide une configuration brute au regard du schéma partagé.
 */
export function validateClientConfig(raw: unknown): ClientConfig {
  return parseClientConfig(raw);
}
