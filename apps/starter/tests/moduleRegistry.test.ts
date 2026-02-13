import { describe, it, expect } from 'vitest';
import {
  getEnabledModules,
  getAllModules,
  getModuleById,
  getSidebarItems,
} from '../src/modules/registry';
import type { ClientConfig } from '../src/lib/config/clientConfig';

describe('moduleRegistry helpers', () => {
  it("active tous les modules par défaut quand aucune config n'est fournie", () => {
    const modules = getEnabledModules();
    expect(modules.length).toBeGreaterThan(0);
  });

  it('respecte la config modules.{id}.enabled', () => {
    const config = {
      modules: {
        dashboard: { enabled: true },
        accounts: { enabled: false },
      },
    } as unknown as ClientConfig;

    const modules = getEnabledModules(config);
    const ids = modules.map((mod) => mod.id);

    expect(ids).toContain('dashboard');
    expect(ids).not.toContain('accounts');
  });

  it('expose tous les modules déclarés via getAllModules', () => {
    const all = getAllModules();
    const ids = all.map((m) => m.id);
    expect(ids).toContain('dashboard');
    expect(ids).toContain('transactions');
  });

  it('getModuleById retourne le module correspondant', () => {
    const mod = getModuleById('dashboard');
    expect(mod).toBeDefined();
    expect(mod?.basePath).toBe('/dashboard');
  });

  it('getSidebarItems construit une navigation cohérente à partir des modules activés', () => {
    const config = {
      modules: {
        dashboard: { enabled: true },
        transactions: { enabled: true },
      },
    } as unknown as ClientConfig;

    const items = getSidebarItems(config, ['transactions:view']);
    const labels = items.map((i) => i.label);

    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Transactions');
  });

  it('getSidebarItems filtre les modules selon permissionsRequired', () => {
    const config = {
      modules: {
        dashboard: { enabled: true },
        transactions: { enabled: true },
      },
    } as unknown as ClientConfig;

    const itemsForNoPerms = getSidebarItems(config, []);
    const labelsNoPerms = itemsForNoPerms.map((i) => i.label);

    // Dashboard est public, Transactions nécessite transactions:view
    expect(labelsNoPerms).toContain('Dashboard');
    expect(labelsNoPerms).not.toContain('Transactions');

    const itemsWithPerm = getSidebarItems(config, ['transactions:view']);
    const labelsWithPerm = itemsWithPerm.map((i) => i.label);

    expect(labelsWithPerm).toContain('Dashboard');
    expect(labelsWithPerm).toContain('Transactions');
  });
});
