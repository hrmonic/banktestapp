/**
 * Menu « Exporter pour réunion » (P0-2) : templates Comptes, Audit 7j, Rapport.
 */
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@bank/ui';
import { useQuickExport } from '../../lib/useQuickExport';

export function ExportQuickMenu(): React.ReactElement {
  const { t } = useTranslation();
  const { exportAccounts, exportAudit7d, exportReport, loading } =
    useQuickExport();
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('click', onOutside, true);
    return () => document.removeEventListener('click', onOutside, true);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t('exportQuick.label')}
      >
        {t('exportQuick.label')}
      </Button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-cursor-border dark:bg-cursor-surface"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-cursor-text dark:hover:bg-cursor-bg"
            onClick={() => {
              void exportAccounts();
              setOpen(false);
            }}
          >
            {t('exportQuick.templateAccounts')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-cursor-text dark:hover:bg-cursor-bg"
            onClick={() => {
              void exportAudit7d();
              setOpen(false);
            }}
          >
            {t('exportQuick.templateAudit7d')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-cursor-text dark:hover:bg-cursor-bg"
            onClick={() => {
              void exportReport();
              setOpen(false);
            }}
          >
            {t('exportQuick.templateReport')}
          </button>
        </div>
      )}
    </div>
  );
}
