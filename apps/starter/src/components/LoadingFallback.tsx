/**
 * Indicateur de chargement affiché pendant le chargement de la config ou des routes lazy.
 */
import React from 'react';

export function LoadingFallback(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span>Chargement de l'interface bancaire…</span>
      </div>
    </div>
  );
}

export default LoadingFallback;
