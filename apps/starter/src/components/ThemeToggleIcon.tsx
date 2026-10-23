/**
 * Bouton icône discret en haut à droite pour basculer entre thème clair et sombre.
 */
import React from 'react';
import { useThemePreferences } from '../lib/theme/themePreferences';

function useResolvedDark(): boolean {
  const { colorScheme } = useThemePreferences();
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const isDark =
      colorScheme === 'dark' ||
      (colorScheme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
  }, [colorScheme]);
  return dark;
}

export function ThemeToggleIcon(): React.ReactElement {
  const { setColorScheme } = useThemePreferences();
  const isDark = useResolvedDark();

  const toggle = (): void => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-cursor-text-muted dark:hover:bg-cursor-surface dark:hover:text-cursor-text focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50 dark:focus:ring-cursor-border dark:focus:ring-offset-cursor-bg"
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
    >
      {isDark ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
