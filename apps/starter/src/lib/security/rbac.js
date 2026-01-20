import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider.js";

// Context for permissions provided by modules or backend.
const PermissionsContext = React.createContext([]);

export function PermissionsProvider({ permissions = [], children }) {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return React.useContext(PermissionsContext);
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
  const { user } = useAuth();
  const permissions = React.useContext(PermissionsContext);
  const hasPermission =
    (user?.roles && user.roles.includes(permission)) ||
    permissions.includes(permission);

  return hasPermission ? children : <Navigate to={redirectTo} replace />;
}
