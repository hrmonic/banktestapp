import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider.js";
import { getPermissionsForProfile } from "./profilePermissions.js";
import { canAccessModule } from "../../modules/registry.js";

// Context for additional permissions provided by modules or backend.
const PermissionsContext = React.createContext([]);

export function PermissionsProvider({ permissions = [], children }) {
  const { user } = useAuth();
  const profile = user?.profile;
  const profilePermissions = getPermissionsForProfile(profile);
  const merged = Array.from(
    new Set([...(permissions || []), ...profilePermissions])
  );

  return (
    <PermissionsContext.Provider value={merged}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return React.useContext(PermissionsContext);
}

/**
 * Ensemble effectif de permissions/roles de l'utilisateur :
 * - rôles issus de AuthProvider (user.roles),
 * - permissions additionnelles injectées via PermissionsProvider
 *   (dont les permissions de profil).
 */
export function useEffectivePermissions() {
  const { user } = useAuth();
  const ctxPermissions = React.useContext(PermissionsContext);
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return Array.from(new Set([...roles, ...ctxPermissions]));
}

/**
 * Guard component to ensure the user is authenticated before
 * accessing protected routes.
 */
export function RequireAuth({ children, redirectTo = "/login" }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

/**
 * Guard component to ensure the user has a given permission/role.
 * Falls back to an unauthorized page when missing.
 */
export function RequirePermission({
  permission,
  children,
  redirectTo = "/unauthorized",
}) {
  const effectivePermissions = useEffectivePermissions();
  const hasPermission = effectivePermissions.includes(permission);

  return hasPermission ? children : <Navigate to={redirectTo} replace />;
}

/**
 * Guard générique pour un module BankModule basé sur permissionsRequired.
 */
export function ModuleRouteGuard({
  module,
  children,
  redirectTo = "/unauthorized",
}) {
  const effectivePermissions = useEffectivePermissions();
  const isAllowed = canAccessModule(module, effectivePermissions);

  return isAllowed ? children : <Navigate to={redirectTo} replace />;
}


