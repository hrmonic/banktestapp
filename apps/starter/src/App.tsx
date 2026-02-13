/**
 * Composant racine : chargement de la config, routage et guards RBAC.
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getEnabledModules } from './modules/registry';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import { useClientConfig } from './lib/useClientConfig';
import {
  RequireAuth,
  ModuleRouteGuard,
  useEffectivePermissions,
} from './lib/security/rbac';
import { getSidebarItems } from './modules/registry';
import { useAuth } from './lib/auth/authProvider';
import { SessionTimeoutWrapper } from './components/SessionTimeoutWrapper';
import type { BankModule } from './core/types';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const LoginCallbackPage = lazy(() => import('./pages/LoginCallbackPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const InvalidConfigPage = lazy(() => import('./pages/InvalidConfigPage'));
const NoModulesPage = lazy(() => import('./pages/NoModulesPage'));

function App(): React.ReactElement {
  const { config, isLoading, error } = useClientConfig();
  const { isAuthenticated } = useAuth();
  const permissions = useEffectivePermissions();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    if (error.name === 'ZodError') {
      return <InvalidConfigPage error={error} />;
    }
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
  const sidebarItems = config ? getSidebarItems(config, permissions) : [];
  const firstAllowedPath = sidebarItems[0]?.to;

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/callback" element={<LoginCallbackPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                modules.length === 0 ? (
                  <Navigate to="/no-modules" replace />
                ) : firstAllowedPath ? (
                  <Navigate to={firstAllowedPath} replace />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            element={
              <RequireAuth redirectTo="/login">
                <SessionTimeoutWrapper>
                  <AppShell config={config} />
                </SessionTimeoutWrapper>
              </RequireAuth>
            }
          >
            <Route path="no-modules" element={<NoModulesPage />} />
            {modules.map((mod: BankModule) => {
              const ModuleRoutes = mod.routes;
              return (
                <Route
                  key={mod.id}
                  path={`${mod.basePath}/*`}
                  element={
                    <ModuleRouteGuard module={mod}>
                      <ModuleRoutes />
                    </ModuleRouteGuard>
                  }
                />
              );
            })}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
