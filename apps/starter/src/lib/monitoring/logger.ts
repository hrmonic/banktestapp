/**
 * Logging côté client (sans PII).
 * En dev : console. En prod : à brancher sur un service (ex. Sentry) via config.
 */

export type LogLevel = 'info' | 'warn' | 'error';

export type LogContext = Record<string, unknown>;

/**
 * Log une erreur ou un message. Ne jamais inclure de données personnelles (email, noms, tokens).
 * Pour les erreurs API : passer uniquement status et path dans context.
 */
export function logError(
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  if (import.meta.env.DEV) {
    const payload = context ? { message, ...context } : { message };
    if (level === 'error') {
      console.error('[app]', payload);
    } else if (level === 'warn') {
      console.warn('[app]', payload);
    } else {
      console.info('[app]', payload);
    }
  }
  // En production, brancher ici un envoi vers un service (ex. Sentry.captureMessage + extra)
}

/**
 * À appeler depuis ErrorBoundary : log l'erreur sans exposer de stack ni infos utilisateur.
 */
export function logBoundaryError(
  error: Error,
  errorInfo?: { componentStack?: string }
): void {
  logError('error', error.message, {
    name: error.name,
    ...(errorInfo?.componentStack && {
      componentStack: errorInfo.componentStack,
    }),
  });
}

/**
 * À appeler après une erreur API : log status et path uniquement (pas le corps de la requête).
 */
export function logApiError(status: number, path: string): void {
  logError('error', `API error ${status}`, { status, path });
}
