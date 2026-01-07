import React from "react";
import { Link, useLocation } from "react-router-dom";
import { moduleRegistry } from "../../modules/registry.js";

export function AppShell({ children }) {
  const modules = moduleRegistry.getEnabledModules();
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <ul>
          {modules.map((mod) => (
            <li
              key={mod.id}
              className={location.pathname.startsWith(mod.basePath) ? "font-bold" : ""}
            >
              <Link to={mod.basePath}>{mod.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
