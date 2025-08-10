import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { moduleRegistry } from "./modules/registry.js";
import { AppShell } from "./components/layout/AppShell.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { LoadingFallback } from "./components/LoadingFallback.jsx";

export default function App() {
  // Initialize module registry without config to load all modules by default
  moduleRegistry.initialize();
  const modules = moduleRegistry.getEnabledModules();
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<AppShell />}> 
              {modules.map((mod) => (
                <Route
                  key={mod.id}
                  path={`${mod.basePath}/*`}
                  element={<mod.routes />}
                />
              ))}
              <Route index element={<Navigate to={modules[0].basePath} />} />
            </Route>
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
