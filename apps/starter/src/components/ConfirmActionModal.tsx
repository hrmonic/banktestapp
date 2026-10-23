/**
 * Modal de confirmation pour actions sensibles (ex. approbation, rejet).
 * Affiche un rappel du contexte + champ motif optionnel.
 */
import React, { useEffect, useRef } from 'react';
import { Button } from '@bank/ui';

export type ConfirmActionModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  /** Libellé du champ motif (optionnel) */
  reasonLabel?: string;
  reasonValue?: string;
  onReasonChange?: (value: string) => void;
  /** Libellé du bouton de confirmation */
  confirmLabel: string;
  /** Variante visuelle du bouton (ex. danger pour rejet) */
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  /** Désactive le bouton pendant la soumission */
  loading?: boolean;
  /** Accessible name for the modal */
  ariaLabelledby?: string;
};

export function ConfirmActionModal({
  open,
  onClose,
  title,
  description,
  reasonLabel,
  reasonValue = '',
  onReasonChange,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  loading = false,
}: ConfirmActionModalProps): React.ReactElement | null {
  const previousOpen = useRef(open);
  const reasonInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !previousOpen.current) {
      previousOpen.current = true;
      setTimeout(() => reasonInputRef.current?.focus(), 0);
    } else if (!open) {
      previousOpen.current = false;
    }
  }, [open]);

  const handleConfirm = async () => {
    await Promise.resolve(onConfirm());
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
      aria-describedby="confirm-action-desc"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <h2
          id="confirm-action-title"
          className="text-lg font-semibold text-slate-900"
        >
          {title}
        </h2>
        <p id="confirm-action-desc" className="mt-2 text-sm text-slate-600">
          {description}
        </p>
        {reasonLabel != null && (
          <div className="mt-4">
            <label
              htmlFor="confirm-action-reason"
              className="block text-sm font-medium text-slate-700"
            >
              {reasonLabel}
            </label>
            <textarea
              id="confirm-action-reason"
              ref={reasonInputRef}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              value={reasonValue}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder={reasonLabel}
              disabled={loading}
              aria-describedby="confirm-action-desc"
            />
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant={confirmVariant === 'danger' ? 'ghost' : 'primary'}
            className={
              confirmVariant === 'danger'
                ? 'text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500'
                : ''
            }
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'En cours…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
