/**
 * Hook de timeout de session (inactivité).
 * Affiche une modal d'avertissement puis déconnecte si l'utilisateur ne prolonge pas.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export type SessionTimeoutConfig = {
  /** Timeout d'inactivité en minutes avant avertissement */
  idleTimeoutMinutes: number;
  /** Secondes d'avertissement (countdown) avant déconnexion automatique */
  warningBeforeLogoutSeconds: number;
};

const DEFAULT_IDLE_MINUTES = 15;
const DEFAULT_WARNING_SECONDS = 60;

const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
] as const;

export type SessionTimeoutResult = {
  /** true quand la modal d'avertissement doit être affichée */
  showWarning: boolean;
  /** Secondes restantes avant déconnexion (pendant le countdown) */
  secondsLeft: number;
  /** Prolonger la session (ferme la modal et réinitialise le timer) */
  extendSession: () => void;
  /** Déconnecter immédiatement */
  logout: () => void;
};

export function useSessionTimeout(
  config: SessionTimeoutConfig | null | undefined,
  onLogout: () => void,
  isActive: boolean
): SessionTimeoutResult {
  const idleMinutes = config?.idleTimeoutMinutes ?? DEFAULT_IDLE_MINUTES;
  const warningSeconds =
    config?.warningBeforeLogoutSeconds ?? DEFAULT_WARNING_SECONDS;

  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(warningSeconds);
  const lastActivityRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearIdleTimer();
    clearCountdown();
    setShowWarning(false);
    onLogout();
  }, [onLogout, clearIdleTimer, clearCountdown]);

  const extendSession = useCallback(() => {
    clearCountdown();
    setShowWarning(false);
    setSecondsLeft(warningSeconds);
    lastActivityRef.current = Date.now();
    scheduleIdleCheck();
  }, [warningSeconds, clearCountdown]);

  const scheduleIdleCheck = useCallback(() => {
    clearIdleTimer();
    if (!isActive || idleMinutes <= 0) return;
    const ms = idleMinutes * 60 * 1000;
    idleTimerRef.current = setTimeout(() => {
      idleTimerRef.current = null;
      setShowWarning(true);
      setSecondsLeft(warningSeconds);
      let remaining = warningSeconds;
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          clearCountdown();
          onLogout();
        }
      }, 1000);
    }, ms);
  }, [
    isActive,
    idleMinutes,
    warningSeconds,
    onLogout,
    clearIdleTimer,
    clearCountdown,
  ]);

  useEffect(() => {
    if (!isActive) return;

    const handleActivity = () => {
      if (showWarning) return;
      lastActivityRef.current = Date.now();
      scheduleIdleCheck();
    };

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, handleActivity)
    );
    scheduleIdleCheck();
    return () => {
      ACTIVITY_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, handleActivity)
      );
      clearIdleTimer();
      clearCountdown();
    };
  }, [
    isActive,
    showWarning,
    scheduleIdleCheck,
    clearIdleTimer,
    clearCountdown,
  ]);

  return { showWarning, secondsLeft, extendSession, logout };
}
