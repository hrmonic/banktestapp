import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SafeHtml } from '../../src/lib/security/SafeHtml';

describe('SafeHtml', () => {
  it('ne rend pas les balises <script> dans le DOM', () => {
    const { container } = render(
      <SafeHtml html={'Hello<script>alert("xss")</script>'} />
    );

    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
  });
});
