/**
 * DEMO ONLY – helper pour stocker/récupérer le profil de démo.
 *
 * Ce mécanisme est strictement réservé aux environnements de démo/tests.
 * En production, le stockage du profil doit être piloté par l'IDP / backend.
 */
import type { ProfileId } from '../../core/constants';

export type DemoProfileId = ProfileId | string;

const DEMO_PROFILE_KEY = 'demo-profile';

/**
 * Récupère le profil de démo depuis le stockage.
 */
export function getDemoProfileFromStorage(): DemoProfileId | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(DEMO_PROFILE_KEY);
  } catch {
    return null;
  }
}

/**
 * Persiste le profil de démo dans le stockage.
 */
export function setDemoProfileInStorage(profile: DemoProfileId): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEMO_PROFILE_KEY, profile);
  } catch {
    // En démo on ignore les erreurs de stockage.
  }
}

/**
 * Supprime le profil de démo du stockage.
 */
export function clearDemoProfileFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DEMO_PROFILE_KEY);
  } catch {
    // best-effort uniquement
  }
}
