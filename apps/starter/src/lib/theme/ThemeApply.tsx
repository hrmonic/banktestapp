/**
 * Applique les préférences de thème (classe dark, densité) sur le document.
 * À rendre à l’intérieur de ThemeProvider.
 */
import React, { useEffect } from 'react';
import { useThemePreferences } from './themePreferences';

export function ThemeApply({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { colorScheme, density } = useThemePreferences();

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      colorScheme === 'dark' ||
      (colorScheme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    if (density === 'compact') root.classList.add('density-compact');
    else root.classList.remove('density-compact');
  }, [colorScheme, density]);

  return <>{children}</>;
}
