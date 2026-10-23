/**
 * Modal d’aide : liste des raccourcis clavier (?, Ctrl+K, G 1–7).
 */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@bank/ui';

export type ShortcutHelpModalProps = {
  open: boolean;
  onClose: () => void;
  /** Items de la sidebar (ordre = index 1–7 pour G 1–7). */
  sidebarItems: { to: string; label: string }[];
};

export function ShortcutHelpModal({
  open,
  onClose,
  sidebarItems,
}: ShortcutHelpModalProps): React.ReactElement | null {
  const { t } = useTranslation();
  const previousOpen = useRef(open);

  useEffect(() => {
    previousOpen.current = open;
  }, [open]);

  if (!open) return null;

  const shortcuts = [
    {
      keys: 'Ctrl+K',
      description: t(
        'shortcuts.search',
        'Ouvrir la recherche / palette de commandes'
      ),
    },
    { keys: '?', description: t('shortcuts.help', 'Afficher cette aide') },
    ...sidebarItems.slice(0, 7).map((item, i) => ({
      keys: `G ${i + 1}`,
      description: t('shortcuts.goToModule', 'Aller à {{label}}', {
        label: item.label,
      }),
    })),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-help-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-cursor-border dark:bg-cursor-surface">
        <h2
          id="shortcut-help-title"
          className="text-lg font-semibold text-slate-900 dark:text-cursor-text"
        >
          {t('shortcuts.title', 'Raccourcis clavier')}
        </h2>
        <dl className="mt-4 space-y-2">
          {shortcuts.map(({ keys, description }) => (
            <div key={keys} className="flex justify-between gap-4 text-sm">
              <dt className="font-mono rounded bg-slate-100 px-2 py-1 text-slate-800 dark:bg-cursor-bg dark:text-cursor-text">
                {keys}
              </dt>
              <dd className="text-slate-600 dark:text-cursor-text-muted">
                {description}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            {t('common.close', 'Fermer')}
          </Button>
        </div>
      </div>
    </div>
  );
}
