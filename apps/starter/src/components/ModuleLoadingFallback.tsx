/**
 * Indicateur de chargement commun pour les vues de module (liste, détail).
 * Spinner + message harmonisé pour une expérience cohérente.
 */
import React from 'react';

type ModuleLoadingFallbackProps = {
  message?: string;
};

const DEFAULT_MESSAGE = 'Chargement…';

export function ModuleLoadingFallback({
  message = DEFAULT_MESSAGE,
}: ModuleLoadingFallbackProps): React.ReactElement {
  return (
    <div
      className="flex items-center justify-center py-8"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span
          className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden="true"
        />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default ModuleLoadingFallback;
