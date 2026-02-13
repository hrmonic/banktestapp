/**
 * Contexte de session : durée de session active et dernière connexion.
 * En démo : sessionStartedAt au login, lastLoginAt/lastLoginOrigin lus depuis localStorage.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from '../auth/authProvider';

const LAST_LOGIN_AT_KEY = 'banktestapp-lastLoginAt';
const LAST_LOGIN_ORIGIN_KEY = 'banktestapp-lastLoginOrigin';

export type SessionInfo = {
  /** Heure de début de la session courante (au login). */
  sessionStartedAt: Date | null;
  /** Dernière connexion (avant celle-ci), pour affichage. */
  lastLoginAt: Date | null;
  /** Origine de la dernière connexion (ex. "cet appareil", IP en prod). */
  lastLoginOrigin: string | null;
};

type SessionContextValue = SessionInfo;

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

type SessionProviderProps = { children: React.ReactNode };

export function SessionProvider({
  children,
}: SessionProviderProps): React.ReactElement {
  const { user, isAuthenticated } = useAuth();
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const [lastLoginAt, setLastLoginAt] = useState<Date | null>(null);
  const [lastLoginOrigin, setLastLoginOrigin] = useState<string | null>(null);
  const previousAuthenticated = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !previousAuthenticated.current) {
      previousAuthenticated.current = true;
      const now = new Date();
      try {
        const prevAt =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(LAST_LOGIN_AT_KEY)
            : null;
        const prevOrigin =
          typeof window !== 'undefined'
            ? window.localStorage.getItem(LAST_LOGIN_ORIGIN_KEY)
            : null;
        if (prevAt) setLastLoginAt(new Date(prevAt));
        setLastLoginOrigin(prevOrigin || 'cet appareil');
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LAST_LOGIN_AT_KEY, now.toISOString());
          window.localStorage.setItem(LAST_LOGIN_ORIGIN_KEY, 'cet appareil');
        }
      } catch {
        // ignore storage errors
      }
      setSessionStartedAt(now);
    } else if (!isAuthenticated) {
      previousAuthenticated.current = false;
      setSessionStartedAt(null);
      setLastLoginAt(null);
      setLastLoginOrigin(null);
    }
  }, [isAuthenticated, user]);

  const value: SessionContextValue = {
    sessionStartedAt,
    lastLoginAt,
    lastLoginOrigin,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionInfo(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (ctx === undefined)
    throw new Error('useSessionInfo must be used within SessionProvider');
  return ctx;
}

/** Minutes écoulées depuis sessionStartedAt. */
export function useSessionDurationMinutes(): number | null {
  const { sessionStartedAt } = useSessionInfo();
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionStartedAt) {
      setMinutes(null);
      return;
    }
    const update = () => {
      setMinutes(
        Math.floor((Date.now() - sessionStartedAt.getTime()) / 60_000)
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [sessionStartedAt]);

  return minutes;
}
