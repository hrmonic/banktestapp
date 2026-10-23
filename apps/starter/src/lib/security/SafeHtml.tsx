import { sanitizeHtml } from './sanitizeHtml';

export type SafeHtmlProps = {
  html: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

/**
 * Composant unique pour rendre du HTML issu de sources externes
 * (ex: client.config.json), avec sanitisation systématique.
 */
export function SafeHtml({
  html,
  as: Component = 'div',
  className,
}: SafeHtmlProps) {
  const sanitized = sanitizeHtml(html);
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: String(sanitized ?? "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") /* aegis-xss-sanitized */ }}
    />
  );
}
