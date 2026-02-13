/**
 * Sélecteur de thème (clair / sombre / système) et/ou densité.
 * Si densityOnly, n'affiche que le bloc densité (thème géré par l’icône en haut à droite).
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemePreferences } from '../lib/theme/themePreferences';
import type { ColorScheme, Density } from '../lib/theme/themePreferences';

export type ThemeSelectorProps = { densityOnly?: boolean };

export function ThemeSelector({
  densityOnly = false,
}: ThemeSelectorProps): React.ReactElement {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme, density, setDensity } =
    useThemePreferences();

  /* Même langage visuel que la nav : actif = accent sur surface sombre (pas de fond blanc) */
  const baseBtn =
    'rounded border px-2 py-1 text-xs font-medium transition-colors ';
  const activeBtn =
    'border-slate-300 bg-slate-200 text-slate-800 dark:border-cursor-border dark:bg-cursor-surface dark:text-cursor-accent';
  const inactiveBtn =
    'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-cursor-border dark:bg-transparent dark:text-cursor-text-muted dark:hover:bg-cursor-surface dark:hover:text-cursor-text';

  return (
    <div className="space-y-2">
      {!densityOnly && (
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-cursor-text-muted">
            {t('theme.label', 'Thème')}
          </p>
          <div className="flex flex-wrap gap-1">
            {(['light', 'dark', 'system'] as ColorScheme[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setColorScheme(value)}
                className={`${baseBtn} ${colorScheme === value ? activeBtn : inactiveBtn}`}
              >
                {t(
                  `theme.${value}`,
                  value === 'light'
                    ? 'Clair'
                    : value === 'dark'
                      ? 'Sombre'
                      : 'Système'
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-cursor-text-muted">
          {t('theme.densityLabel', 'Densité')}
        </p>
        <div className="flex flex-wrap gap-1">
          {(['comfortable', 'compact'] as Density[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDensity(value)}
              className={`${baseBtn} ${density === value ? activeBtn : inactiveBtn}`}
            >
              {t(
                `theme.density.${value}`,
                value === 'comfortable' ? 'Confortable' : 'Compact'
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
