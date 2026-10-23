import type { Page } from '@playwright/test';

type ClientConfig = {
  branding: {
    name: string;
    logo?: string;
    primaryColor?: string;
  };
  api?: {
    baseUrl?: string;
    timeout?: number;
  };
  modules?: Record<string, { enabled?: boolean }>;
  auth?: {
    type: string;
    issuer: string;
    clientId: string;
  };
};

export const demoValidConfig: ClientConfig = {
  branding: { name: 'Demo bank' },
  api: { baseUrl: 'https://api.example.com' },
  modules: {
    dashboard: { enabled: true },
    transactions: { enabled: true },
    'users-roles': { enabled: true },
  },
};

export const invalidConfigBaseUrlNotUrl: ClientConfig = {
  branding: { name: 'XSS Demo', logo: '</script><script>alert(1)</script>' },
  modules: {
    dashboard: { enabled: true },
  },
  // baseUrl volontairement invalide pour déclencher une ZodError côté app
  api: { baseUrl: 'notaurl' },
};

export async function withClientConfig(
  page: Page,
  config: ClientConfig
): Promise<void> {
  await page.route(/client\.config\.json/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(config),
    });
  });
}
