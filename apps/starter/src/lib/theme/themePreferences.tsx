/**
 * Préférences de thème (couleur et densité) avec persistance localStorage.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = 'banktestapp-theme';

export type ColorScheme = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'comfortable';

export type ThemePreferences = {
  colorScheme: ColorScheme;
  density: Density;
};

const DEFAULT: ThemePreferences = {
  colorScheme: 'system',
  density: 'comfortable',
};

function loadFromStorage(): ThemePreferences {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<ThemePreferences>;
    return {
      colorScheme:
        parsed.colorScheme === 'light' || parsed.colorScheme === 'dark'
          ? parsed.colorScheme
          : 'system',
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
    };
  } catch {
    return DEFAULT;
  }
}

function saveToStorage(prefs: ThemePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

type ThemeContextValue = ThemePreferences & {
  setColorScheme: (v: ColorScheme) => void;
  setDensity: (v: Density) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [prefs, setPrefs] = useState<ThemePreferences>(loadFromStorage);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    saveToStorage(prefs);
  }, [prefs]);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setPrefs((p) => ({ ...p, colorScheme }));
  }, []);
  const setDensity = useCallback((density: Density) => {
    setPrefs((p) => ({ ...p, density }));
  }, []);

  const value: ThemeContextValue = { ...prefs, setColorScheme, setDensity };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemePreferences(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined)
    throw new Error('useThemePreferences must be used within ThemeProvider');
  return ctx;
}
