import { describe, it, expect } from 'vitest';
import { getEnabledModules, getSidebarItems } from '../../src/modules/registry';

const baseConfig = {
  branding: {
    name: 'Demo bank',
  },
  api: {
    baseUrl: 'https://api.example.com',
  },
  modules: {
    dashboard: { enabled: true },
    transactions: { enabled: true },
    'users-roles': { enabled: true },
  },
};

describe('config & RBAC integration', () => {
  it('désactiver un module via config le retire des modules activés', () => {
    const config = {
      ...baseConfig,
      modules: {
        ...baseConfig.modules,
        transactions: { enabled: false },
      },
    };

    const enabled = getEnabledModules(config);
    const ids = enabled.map((m) => m.id);

    expect(ids).toContain('dashboard');
    expect(ids).not.toContain('transactions');
  });

  it('la sidebar reflète bien les modules et permissions pour un profil manager', () => {
    const config = baseConfig;
    const managerPermissions = [
      'accounts:view',
      'accounts:edit',
      'transactions:view',
      'dashboard:view',
      'reports:view',
    ];

    const items = getSidebarItems(config, managerPermissions);
    const labels = items.map((i) => i.label.toLowerCase());

    expect(labels).toContain('dashboard');
    expect(labels).toContain('transactions');
  });

  it("le profil agent n'a pas accès à Users & Roles dans la sidebar", () => {
    const config = baseConfig;
    const agentPermissions = ['accounts:view', 'dashboard:view'];

    const items = getSidebarItems(config, agentPermissions);
    const labels = items.map((i) => i.label.toLowerCase());

    expect(labels).not.toContain('users & roles'.toLowerCase());
  });
});
