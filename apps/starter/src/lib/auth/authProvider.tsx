/**
 * Provider d'authentification de démo.
 *
 * En production, remplacer par un provider piloté par un IDP (OIDC, SAML, etc.).
 */
import React, { createContext, useState, useContext, useCallback } from 'react';
import {
  getDemoProfileFromStorage,
  setDemoProfileInStorage,
  clearDemoProfileFromStorage,
} from './demoProfileStorage';
import type { AuthUser, AuthContextValue } from './authTypes';

/** Exporté pour permettre à OidcAuthProvider d’utiliser le même contexte. */
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

function getInitialUserFromStorage(): AuthUser | null {
  const storedProfile = getDemoProfileFromStorage();
  if (!storedProfile) return null;
  return {
    name: 'Utilisateur',
    profile: storedProfile,
    roles: [storedProfile],
  };
}

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(getInitialUserFromStorage);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: unknown) => {
    void credentials; // Non utilisé en démo ; requis par AuthContextValue.
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedProfile = getDemoProfileFromStorage();
    const profile = storedProfile ?? 'admin-backoffice';
    setDemoProfileInStorage(profile);
    setUser({ name: 'Utilisateur', profile, roles: [profile] });
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearDemoProfileFromStorage();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour accéder au contexte d'authentification.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined)
    throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
