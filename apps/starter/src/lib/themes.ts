/**
 * Catalogue minimal de thèmes.
 * Chaque client pourra pointer sur un `themeKey` dans client.config.json.
 */
export const THEMES = {
  default: {
    name: 'Default',
    primaryColor: '#4e0aaf',
  },
  'neo-bank': {
    name: 'Neo-bank',
    primaryColor: '#059669',
  },
  'private-banking': {
    name: 'Private banking',
    primaryColor: '#1e3a8a',
  },
} as const;

export type ThemeKey = keyof typeof THEMES;

export type ThemeEntry = {
  name: string;
  primaryColor: string;
};

type ConfigWithThemeKey = { themeKey?: string };

/**
 * Récupère les tokens de thème à partir de la configuration client.
 * Pour l'instant, ces tokens ne sont pas encore câblés dans le CSS,
 * mais la structure est prête pour une future intégration.
 */
export function getThemeFromConfig(
  config: ConfigWithThemeKey | null | undefined
): ThemeEntry {
  const themeKey = (config?.themeKey || 'default') as ThemeKey;
  return THEMES[themeKey] ?? THEMES.default;
}
