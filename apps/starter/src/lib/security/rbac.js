import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider.js";

// Context for permissions provided by modules or backend
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

export function RequireAuth({ children, redirectT/login" }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

export function RequirePermission({ permission, children, redirectTo = "/unauthorized" }) {
  const { user } = useAuth();
  const permissions = React.useContext(PermissionsContext);
  const hasPermission = (user?.roles && user.roles.includes(permission)) || permissions.includes(permission);
  return hasPermission ? children : <Navigate to={redirectTo} replace />;
}
