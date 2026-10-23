/**
 * Tests offensifs (Anti-Hacker) : tentatives de contournement et d'exploitation.
 * Ces scénarios simulent des attaques pour vérifier que les contrôles tiennent.
 */
import { describe, it, expect } from 'vitest';
import { createApiClient } from '../../src/lib/api/apiClient';
import type { ClientConfig } from '../../src/lib/config/clientConfig';
import { validateClientConfig } from '../../src/lib/config/clientConfig';
import {
  getPermissionsForProfile,
  PROFILE_IDS,
} from '../../src/lib/security/profilePermissions';
import { sanitizeHtml } from '../../src/lib/security/sanitizeHtml';

const baseConfig: ClientConfig = {
  branding: { name: 'Demo', logo: '/logo.svg', primaryColor: '#000' },
  modules: { dashboard: { enabled: true } },
  api: { baseUrl: 'https://api.example.com', timeout: 5000 },
  auth: {
    type: 'oidc',
    issuer: 'https://idp.example.com',
    clientId: 'demo',
  },
};

describe('Adversarial: apiClient', () => {
  const client = createApiClient(baseConfig);
  const get = (client as { get: (u: string) => Promise<unknown> }).get.bind(
    client
  );

  it('rejette les URLs absolues http', () => {
    expect(() => get('http://evil.example.com/')).toThrow(
      /Absolute URLs are not allowed/
    );
  });

  it('rejette les URLs protocol-relative (SSRF / bypass)', () => {
    expect(() => get('//evil.example.com/path')).toThrow(
      /Protocol-relative URLs are not allowed/
    );
  });

  it('rejette le schéma javascript:', () => {
    expect(() => get('javascript:alert(1)')).toThrow(
      /Dangerous URL schemes are not allowed/
    );
  });

  it('rejette le schéma vbscript:', () => {
    expect(() => get('vbscript:alert(1)')).toThrow(
      /Dangerous URL schemes are not allowed/
    );
  });

  it('rejette le schéma file:', () => {
    expect(() => get('file:///etc/passwd')).toThrow(
      /Dangerous URL schemes are not allowed/
    );
  });

  it('rejette le schéma blob:', () => {
    expect(() => get('blob:https://evil.example.com/uuid')).toThrow(
      /Dangerous URL schemes are not allowed/
    );
  });
});

describe('Adversarial: RBAC / profil inconnu', () => {
  it('un profil inconnu (tampering localStorage) ne reçoit aucune permission', () => {
    const perms = getPermissionsForProfile('random-attacker-profile');
    expect(perms).toEqual([]);
  });

  it('un profil vide string ne reçoit pas ADMIN par défaut', () => {
    const perms = getPermissionsForProfile('');
    expect(perms).toEqual([]);
  });

  it('les profils reconnus conservent leurs permissions', () => {
    const adminPerms = getPermissionsForProfile(PROFILE_IDS.ADMIN);
    const agentPerms = getPermissionsForProfile(PROFILE_IDS.AGENT);
    expect(adminPerms.length).toBeGreaterThan(agentPerms.length);
    expect(adminPerms).toContain('admin');
  });
});

describe('Adversarial: sanitizeHtml (XSS)', () => {
  it('supprime les event handlers (onclick, onerror, etc.)', () => {
    const payload = '<img src=x onerror="window.__xss=1">';
    const out = sanitizeHtml(payload);
    expect(out).not.toMatch(/onerror/i);
    expect(out).not.toContain('__xss');
  });

  it('supprime javascript: dans les attributs', () => {
    const payload = '<a href="javascript:alert(1)">click</a>';
    const out = sanitizeHtml(payload);
    expect(out).not.toMatch(/javascript:/i);
  });

  it('supprime data: URL dangereuses en contexte script', () => {
    const payload =
      '<object data="data:text/html,<script>window.__xss=1</script>">';
    const out = sanitizeHtml(payload);
    expect(out).not.toContain('__xss');
  });
});

describe('Adversarial: config', () => {
  it('rejette une config vide (payload malformé)', () => {
    expect(() => validateClientConfig({})).toThrow();
  });

  it('rejette une config avec branding.name non string', () => {
    expect(() =>
      validateClientConfig({
        branding: { name: 123 },
        modules: {},
        api: { baseUrl: 'https://api.example.com' },
      })
    ).toThrow();
  });

  it('rejette une config avec api.baseUrl invalide', () => {
    expect(() =>
      validateClientConfig({
        branding: { name: 'Demo' },
        modules: {},
        api: { baseUrl: 'not-a-valid-url' },
      })
    ).toThrow();
  });

  it('rejette une config avec champs requis manquants', () => {
    expect(() => validateClientConfig(null)).toThrow();
    expect(() => validateClientConfig(undefined)).toThrow();
  });
});
