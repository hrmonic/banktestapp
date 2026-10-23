/**
 * Bandeau discret affiché en haut de l'app lorsque auth.mode === "demo".
 * Masqué en production (config sans mode démo).
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useClientConfig } from '../lib/useClientConfig';
import { isDemoAuth } from '../lib/config/clientConfig';

export function DemoModeBanner(): React.ReactElement | null {
  const { t } = useTranslation();
  const { config } = useClientConfig();
  if (!config || !isDemoAuth(config)) return null;

  return (
    <div
      className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-center text-sm text-slate-600 dark:border-cursor-border dark:bg-cursor-surface dark:text-cursor-text-muted"
      role="status"
      aria-live="polite"
    >
      {t('shell.demoModeBanner')}
    </div>
  );
}
