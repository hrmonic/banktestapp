import { describe, it, expect } from 'vitest';
import { createApiClient } from '../../src/lib/api/apiClient';
import type { ClientConfig } from '../../src/lib/config/clientConfig';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

const baseConfig: ClientConfig = {
  branding: {
    name: 'Demo Bank',
    logo: '/logo.svg',
    primaryColor: '#0055ff',
  },
  modules: {
    dashboard: { enabled: true },
  },
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  },
  auth: {
    type: 'oidc',
    issuer: 'https://idp.example.com',
    clientId: 'demo-client-id',
  },
};

describe('apiClient', () => {
  it('rejects absolute URLs', async () => {
    const client = createApiClient(baseConfig);

    await expect(async () => {
      await (client as { get: (url: string) => Promise<unknown> }).get(
        'https://malicious.example.com/evil'
      );
    }).rejects.toThrowError(/Absolute URLs are not allowed/);
  });

  it('prefixes relative paths with api.baseUrl and hits the expected endpoint', async () => {
    const client = createApiClient(baseConfig);

    let calledUrl: string | null = null;

    server.use(
      http.get('https://api.example.com/transactions', ({ request }) => {
        calledUrl = request.url;
        return HttpResponse.json({
          ok: true,
        });
      })
    );

    const result = await client.get<{ ok: boolean }>('/transactions', {
      headers: {
        'X-Test': '1',
      },
    });

    expect(result.ok).toBe(true);
    expect(calledUrl).toBe('https://api.example.com/transactions');
  });
});
