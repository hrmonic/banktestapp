import React from "react";
import { VirtualizedList } from "./VirtualizedList.jsx";

/**
 * Design system ultra léger pour la vitrine.
 * Ces composants sont pensés comme base réutilisable
 * dans les différents modules du backoffice.
 */

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-60",
    ghost:
      "bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500",
    subtle:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageLayout({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <header>
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}

export function Placeholder({ children }) {
  return (
    <div className="rounded border border-dashed border-gray-300 p-2 text-sm text-gray-500">
      {children ?? "UI Placeholder"}
    </div>
  );
}

// Exporte aussi VirtualizedList en tant qu'export nommé pour permettre
// `import { VirtualizedList } from "@bank/ui"` côté app.
export { VirtualizedList };

export default {
  Button,
  Card,
  PageLayout,
  Placeholder,
  VirtualizedList,
};
