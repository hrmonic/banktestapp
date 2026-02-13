import DOMPurify from 'dompurify';

/**
 * Sanitize un fragment HTML potentiellement fourni par une configuration
 * externe (ex: client.config.json).
 *
 * - En environnement navigateur : DOMPurify.sanitize(input).
 * - Hors navigateur (Node/SSR) : retourne une chaîne vide pour ne jamais
 *   exposer du HTML non sanitisé. À n'utiliser que côté client pour du rendu HTML.
 *
 * Cette fonction doit être utilisée en amont de tout `dangerouslySetInnerHTML`
 * ou rendu de contenu riche issu de la configuration.
 */
export function sanitizeHtml(input: string): string {
  if (
    typeof window === 'undefined' ||
    typeof DOMPurify.sanitize !== 'function'
  ) {
    return '';
  }

  return DOMPurify.sanitize(input);
}
