/**
 * Fil d'Ariane pour la navigation liste → détail (accessibilité et repère).
 */
import React from 'react';
import { Link } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  to: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps): React.ReactElement {
  if (items.length === 0) return <></>;
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-600">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className="flex items-center gap-1.5"
              aria-current={isLast && !item.to ? 'page' : undefined}
            >
              {i > 0 && (
                <span className="text-slate-400 select-none" aria-hidden="true">
                  /
                </span>
              )}
              {!isLast && item.to ? (
                <Link
                  to={item.to}
                  className="text-primary hover:text-primary-hover hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-slate-900' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
