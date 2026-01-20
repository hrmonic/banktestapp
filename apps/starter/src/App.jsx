import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getEnabledModules } from "./modules/registry.js";
import { AppShell } from "./components/layout/AppShell.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { LoadingFallback } from "./components/LoadingFallback.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useClientConfig } from "./lib/useClientConfig.js";
import { RequireAuth, ModuleRouteGuard } from "./lib/security/rbac.js";

function App() {
  const { config, isLoading, error } = useClientConfig();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p>Impossible de charger la configuration.</p>
        <button
          type="button"
          className="mt-4 inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  const modules = config ? getEnabledModules(config) : [];

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={<Navigate to={modules[0]?.basePath || "/"} replace />}
          />
          <Route
            element={
              <RequireAuth redirectTo="/login">
                <AppShell config={config} />
              </RequireAuth>
            }
          >
            {modules.map((mod) => (
              <Route
                key={mod.id}
                path={`${mod.basePath}/*`}
                element={
                  <ModuleRouteGuard module={mod}>
                    <mod.routes />
                  </ModuleRouteGuard>
                }
              />
            ))}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
