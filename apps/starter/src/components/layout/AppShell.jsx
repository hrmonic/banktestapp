import React from "react";
import { Link, useLocation } from "react-router-dom";
import { moduleRegistry } from "../../modules/registry.js";
import { PageLayout } from "@bank/ui";

/**
 * Shell d'application principal pour le backoffice.
 * - Gère le layout global (sidebar + contenu).
 * - Construit la navigation à partir du moduleRegistry.
 */
export function AppShell({ children }) {
  const modules = moduleRegistry.getEnabledModules();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Backoffice
          </span>
          <span className="mt-1 block text-sm font-bold text-slate-900">
            Modular BankUI Studio
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {modules.map((mod) => {
              const isActive = location.pathname.startsWith(mod.basePath);
              return (
                <li key={mod.id}>
                  <Link
                    to={mod.basePath}
                    className={[
                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <span>{mod.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <footer className="border-t border-slate-200 p-3 text-xs text-slate-500">
          Demo • No real data
        </footer>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <PageLayout>{children}</PageLayout>
      </main>
    </div>
  );
}
