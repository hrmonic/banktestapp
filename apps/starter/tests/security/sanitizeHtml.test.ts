import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../../src/lib/security/sanitizeHtml';

describe('sanitizeHtml', () => {
  it("retire les balises <script> d'un fragment HTML malveillant", () => {
    const malicious =
      'Hello<script>alert("xss")</script><img src="x" onerror="alert(1)" />';

    const result = sanitizeHtml(malicious);

    expect(result).not.toContain('<script');
    expect(result).not.toContain('onerror=');
  });

  it('retire tout script pouvant exécuter du code (payload __xss_flag)', () => {
    const payload =
      'Texte<script>window.__xss_flag=1</script><img src=x onerror="window.__xss_flag=1">';
    const result = sanitizeHtml(payload);

    expect(result).not.toContain('<script');
    expect(result).not.toContain('onerror=');
    expect(result).not.toContain('__xss_flag');
  });
});
