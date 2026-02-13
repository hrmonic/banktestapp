/**
 * Provider d'authentification OIDC (tokens en mémoire uniquement).
 * En production : redirect vers IDP, callback, refresh, logout vers IDP.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserManager } from 'oidc-client-ts';
import { AuthContext } from './authProvider';
import { memoryStateStore } from './memoryStore';
import { getPermissionsForProfile } from '../security/profilePermissions';
import type { AuthContextValue, AuthUser } from './authTypes';
import type { ClientConfig } from '../config/clientConfig';

function getRedirectUri(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/login/callback`;
}

function oidcUserToAuthUser(profile: Record<string, unknown>): AuthUser {
  const name =
    (profile.name as string) ??
    (profile.preferred_username as string) ??
    (profile.sub as string) ??
    'Utilisateur';
  const profileId =
    (profile.role as string) ??
    (profile.profile as string) ??
    'admin-backoffice';
  const roles = Array.isArray(profile.roles)
    ? (profile.roles as string[])
    : profile.role
      ? [profile.role as string]
      : getPermissionsForProfile(profileId).length > 0
        ? [profileId]
        : ['admin-backoffice'];
  return { name, profile: profileId, roles };
}

type OidcAuthProviderProps = {
  children: React.ReactNode;
  config: ClientConfig;
};

export function OidcAuthProvider({
  children,
  config,
}: OidcAuthProviderProps): React.ReactElement {
  const auth = config.auth;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const managerRef = useRef<UserManager | null>(null);

  useEffect(() => {
    if (!auth?.issuer || !auth?.clientId) {
      setLoading(false);
      return;
    }
    const redirectUri = getRedirectUri();
    const manager = new UserManager({
      authority: auth.issuer,
      client_id: auth.clientId,
      redirect_uri: redirectUri,
      post_logout_redirect_uri: window.location.origin + '/login',
      userStore: memoryStateStore,
      stateStore: memoryStateStore,
      scope: 'openid profile',
    });
    managerRef.current = manager;

    manager.getUser().then((oidcUser) => {
      if (oidcUser && !oidcUser.expired) {
        setUser(
          oidcUserToAuthUser(oidcUser.profile as Record<string, unknown>)
        );
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, [auth?.issuer, auth?.clientId]);

  const login = useCallback(async () => {
    const manager = managerRef.current;
    if (!manager) return;
    setLoading(true);
    try {
      await manager.signinRedirect();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const manager = managerRef.current;
    if (!manager) {
      setUser(null);
      return;
    }
    setUser(null);
    void manager.signoutRedirect();
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
