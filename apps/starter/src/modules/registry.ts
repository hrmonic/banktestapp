/**
 * Enregistrement statique des modules métier et helpers (getEnabledModules, canAccessModule, getSidebarItems).
 * L’activation/désactivation est pilotée par client.config.json.
 */
import type { BankModule, BankModuleSidebarItem } from '../core/types';
import type { ClientConfig } from '../lib/config/clientConfig';

import dashboard from './dashboard/module';
import accounts from './accounts/module';
import transactions from './transactions/module';
import approvals from './approvals/module';
import usersRoles from './users-roles/module';
import reports from './reports/module';
import audit from './audit/module';

const allModules: Record<string, BankModule> = {
  dashboard,
  accounts,
  transactions,
  approvals,
  'users-roles': usersRoles,
  reports,
  audit,
};

/**
 * Retourne la liste des modules activés selon la configuration client.
 */
export function getEnabledModules(config?: ClientConfig | null): BankModule[] {
  const modulesConfig = config?.modules;
  const enabledIds = modulesConfig
    ? Object.entries(modulesConfig)
        .filter(([, value]) => value?.enabled !== false)
        .map(([id]) => id)
    : Object.keys(allModules);

  return enabledIds
    .map((id) => allModules[id])
    .filter((m): m is BankModule => Boolean(m));
}

/**
 * Retourne tous les modules déclarés, sans filtrage.
 */
export function getAllModules(): BankModule[] {
  return Object.values(allModules);
}

/**
 * Retourne un module par identifiant.
 */
export function getModuleById(id: string): BankModule | undefined {
  return allModules[id];
}

/**
 * Indique si l’utilisateur avec les permissions données peut accéder au module.
 */
export function canAccessModule(
  module: BankModule,
  permissions: string[]
): boolean {
  const required = module.permissionsRequired ?? [];
  if (required.length === 0) return true;
  return required.some((perm) => permissions.includes(perm));
}

/**
 * Construit les items de sidebar à partir des modules activés et des permissions.
 */
export function getSidebarItems(
  config?: ClientConfig | null,
  userPermissions: string[] = []
): BankModuleSidebarItem[] {
  const modules = getEnabledModules(config);
  return modules
    .filter((mod) => canAccessModule(mod, userPermissions))
    .flatMap((mod) =>
      (mod.sidebarItems ?? []).map((item) => ({
        ...item,
        to: item.to || mod.basePath,
        order: item.order ?? 0,
      }))
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
