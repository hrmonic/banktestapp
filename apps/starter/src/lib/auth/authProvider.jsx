import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    // TODO: call real auth API with credentials
    await new Promise((resolve) => setTimeout(resolve, 500));
    // For now, set a dummy user with a banking profile.
    // The profile can be overridden via localStorage ("demo-profile") for demos/tests.
    const storedProfile =
      typeof window !== "undefined"
        ? window.localStorage.getItem("demo-profile")
        : null;
    const profile = storedProfile || "admin-backoffice";
    // On stocke le profil et un rôle générique égal au profil pour compatibilité.
    setUser({ name: "Utilisateur", profile, roles: [profile] });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


