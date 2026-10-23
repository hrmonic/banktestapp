/**
 * Config client valide pour les tests (ConfigProvider initialConfig).
 */
import { validateClientConfig } from '../src/lib/config/clientConfig';

export const testClientConfig = validateClientConfig({
  branding: { name: 'Test Bank' },
  themeKey: 'default',
  modules: {
    dashboard: { enabled: true },
    accounts: { enabled: true, exportEnabled: true },
    transactions: { enabled: true },
    approvals: { enabled: true },
    'users-roles': { enabled: true },
    reports: { enabled: true },
    audit: { enabled: true },
  },
  api: { baseUrl: 'https://api.test.com', timeout: 5000 },
  auth: {
    type: 'oidc',
    issuer: 'https://idp.test.com',
    clientId: 'test',
    mode: 'demo',
  },
});
