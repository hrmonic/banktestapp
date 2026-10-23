/**
 * RBAC : guards et contexte de permissions (RequireAuth, RequirePermission, ModuleRouteGuard).
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/authProvider';
import { getPermissionsForProfile } from './profilePermissions';
import { canAccessModule } from '../../modules/registry';
import type {
  PermissionId,
  PermissionsProviderProps,
  RequireAuthProps,
  RequirePermissionProps,
  ModuleRouteGuardProps,
} from './rbacTypes';

const PermissionsContext = React.createContext<PermissionId[]>([]);

/**
 * Fournit un ensemble de permissions supplémentaires (ex. backend, module).
 */
export function PermissionsProvider({
  permissions = [],
  children,
}: PermissionsProviderProps): React.ReactElement {
  const { user } = useAuth();
  const profile = user?.profile;
  const profilePermissions = getPermissionsForProfile(profile);
  const merged = Array.from(
    new Set([...(permissions ?? []), ...profilePermissions])
  );

  return (
    <PermissionsContext.Provider value={merged}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook bas niveau pour accéder aux permissions du contexte.
 */
export function usePermissions(): PermissionId[] {
  return React.useContext(PermissionsContext);
}

/**
 * Ensemble effectif des permissions/roles de l'utilisateur courant.
 */
export function useEffectivePermissions(): PermissionId[] {
  const { user } = useAuth();
  const ctxPermissions = React.useContext(PermissionsContext);
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return Array.from(new Set([...roles, ...ctxPermissions]));
}

/**
 * Guard : redirige vers /login si non authentifié.
 */
export function RequireAuth({
  children,
  redirectTo = '/login',
}: RequireAuthProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

/**
 * Guard : redirige vers /unauthorized si la permission manque.
 */
export function RequirePermission({
  permission,
  children,
  redirectTo = '/unauthorized',
}: RequirePermissionProps): React.ReactElement {
  const effectivePermissions = useEffectivePermissions();
  const hasPermission = effectivePermissions.includes(permission);
  return hasPermission ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

/**
 * Guard pour un module BankModule basé sur permissionsRequired.
 */
export function ModuleRouteGuard({
  module,
  children,
  redirectTo = '/unauthorized',
}: ModuleRouteGuardProps): React.ReactElement {
  const effectivePermissions = useEffectivePermissions();
  const isAllowed = canAccessModule(module, effectivePermissions);
  return isAllowed ? <>{children}</> : <Navigate to={redirectTo} replace />;
}
