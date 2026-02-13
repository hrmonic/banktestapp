/**
 * Gestion centralisée des erreurs API : mapping status → message utilisateur et retryable.
 */

export type ApiErrorPayload = {
  message: string;
  retryable: boolean;
};

/**
 * Extrait un message d'erreur du corps de réponse (si l'API renvoie un champ standard).
 */
function getMessageFromBody(body: unknown): string | null {
  if (body == null || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  if (typeof o.message === 'string') return o.message;
  if (typeof o.error === 'string') return o.error;
  if (typeof o.detail === 'string') return o.detail;
  return null;
}

/**
 * Map code HTTP vers message utilisateur et indicateur retry.
 * Les messages pourront être remplacés par des clés i18n en Phase 3.
 */
export function handleApiError(
  status: number,
  body?: unknown
): ApiErrorPayload {
  const fromBody = getMessageFromBody(body);

  switch (status) {
    case 400:
      return { message: fromBody ?? 'Requête invalide.', retryable: false };
    case 401:
      return {
        message:
          fromBody ??
          'Session expirée ou non authentifié. Veuillez vous reconnecter.',
        retryable: false,
      };
    case 403:
      return {
        message:
          fromBody ?? "Vous n'avez pas les droits pour effectuer cette action.",
        retryable: false,
      };
    case 404:
      return {
        message: fromBody ?? 'Ressource introuvable.',
        retryable: false,
      };
    case 408:
      return {
        message: fromBody ?? 'Délai dépassé. Vous pouvez réessayer.',
        retryable: true,
      };
    case 429:
      return {
        message: fromBody ?? 'Trop de requêtes. Réessayez plus tard.',
        retryable: true,
      };
    default:
      if (status >= 500) {
        return {
          message: fromBody ?? 'Erreur serveur. Veuillez réessayer.',
          retryable: true,
        };
      }
      return { message: fromBody ?? `Erreur ${status}.`, retryable: false };
  }
}

/**
 * Erreur typée levée par l'API client (status, message, retryable).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryable: boolean,
    public readonly path?: string
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
