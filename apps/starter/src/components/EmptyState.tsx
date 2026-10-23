/**
 * État vide réutilisable : message positif + action suggérée (lien ou bouton).
 * Utilisé pour listes vides, aucun résultat de recherche, etc.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@bank/ui';

export type EmptyStateProps = {
  /** Message principal (ex. "Tout est à jour", "Aucun résultat") */
  message: string;
  /** Libellé du lien ou bouton d’action (optionnel) */
  actionLabel?: string;
  /** Route vers laquelle naviguer (prioritaire sur onAction si les deux sont fournis) */
  actionTo?: string;
  /** Callback si action = bouton (ex. Rafraîchir) */
  onAction?: () => void;
  /** Contenu optionnel (illustration, icône) */
  children?: React.ReactNode;
  /** Classe CSS additionnelle */
  className?: string;
};

export function EmptyState({
  message,
  actionLabel,
  actionTo,
  onAction,
  children,
  className = '',
}: EmptyStateProps): React.ReactElement {
  const hasAction =
    actionLabel != null &&
    actionLabel !== '' &&
    (actionTo != null || onAction != null);

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {children != null && <div className="mb-3">{children}</div>}
      <p className="text-sm text-slate-600">{message}</p>
      {hasAction && (
        <div className="mt-3">
          {actionTo != null ? (
            <Link
              to={actionTo}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {actionLabel}
            </Link>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
