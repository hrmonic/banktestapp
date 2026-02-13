import { getSidebarItems } from '../../src/modules/registry';
import {
  PROFILE_IDS,
  getPermissionsForProfile,
} from '../../src/lib/security/profilePermissions';
import type { ProfileId } from '../../src/core/constants';
import type { ClientConfig } from '../../src/lib/config/clientConfig';

function renderWithProfile(profile: ProfileId | string) {
  const permissions = getPermissionsForProfile(profile);
  const config = {
    modules: {
      dashboard: { enabled: true },
      accounts: { enabled: true },
      transactions: { enabled: true },
      approvals: { enabled: true },
      'users-roles': { enabled: true },
      reports: { enabled: true },
      audit: { enabled: true },
    },
  } as unknown as ClientConfig;
  return getSidebarItems(config, permissions);
}

describe('sidebar by profile', () => {
  it("montre un sous-ensemble de modules pour l'agent d'agence", () => {
    const items = renderWithProfile(PROFILE_IDS.AGENT);
    const labels = items.map((item) => item.label);
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Accounts');
    expect(labels).not.toContain('Users & Roles');
  });

  it("inclut Users & Roles pour l'admin backoffice", () => {
    const items = renderWithProfile(PROFILE_IDS.ADMIN);
    const labels = items.map((item) => item.label);
    expect(labels).toContain('Users & Roles');
  });
});
