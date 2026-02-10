import dashboard from "./dashboard/module.js";
import accounts from "./accounts/module.js";
import transactions from "./transactions/module.js";
import approvals from "./approvals/module.js";
import usersRoles from "./users-roles/module.js";
import reports from "./reports/module.js";
import audit from "./audit/module.js";

/** @typedef {import("../core/types").BankModule} BankModule */
/** @typedef {import("../lib/config/clientConfig").ClientConfig} ClientConfig */

  /**
 * Enregistrement statique de tous les modules connus de l'application.
   *
 * La logique d'activation/désactivation est pure et pilotée par client.config.json.
 */
const allModules = /** @type {Record<string, BankModule>} */ ({
      dashboard,
      accounts,
      transactions,
      approvals,
      "users-roles": usersRoles,
      reports,
      audit,
});

/**
 * Retourne la liste des modules activés en fonction de la configuration client.
 *
 * @param {ClientConfig=} config
 * @returns {BankModule[]}
 */
export function getEnabledModules(config) {
    const modulesConfig = config?.modules;

  // Si aucune config n'est fournie, on active tous les modules connus.
    const enabledIds = modulesConfig
      ? Object.entries(modulesConfig)
          .filter(([, value]) => value?.enabled !== false)
          .map(([id]) => id)
    : Object.keys(allModules);

  return enabledIds
    .map((id) => allModules[id])
      .filter(Boolean);
}

/**
 * Retourne tous les modules déclarés, sans filtrage.
 *
 * @returns {BankModule[]}
 */
export function getAllModules() {
  return Object.values(allModules);
  }

/**
 * Retourne un module à partir de son identifiant.
 *
 * @param {string} id
 * @returns {BankModule | undefined}
 */
export function getModuleById(id) {
  return allModules[id];
}

/**
 * Retourne true si un utilisateur avec un ensemble de permissions donné
 * peut accéder à un module.
 *
 * @param {BankModule} module
 * @param {string[]} permissions
 */
export function canAccessModule(module, permissions) {
  const required = module.permissionsRequired || [];
  if (required.length === 0) return true;
  return required.some((perm) => permissions.includes(perm));
}

/**
 * Construit les items de sidebar à partir des modules activés
 * et éventuellement des permissions de l'utilisateur.
 *
 * @param {ClientConfig=} config
 * @param {string[]=} userPermissions
 * @returns {import("./types.d.js").BankModuleSidebarItem[]}
 */
export function getSidebarItems(config, userPermissions = []) {
  const modules = getEnabledModules(config);

  return modules
    .filter((mod) => canAccessModule(mod, userPermissions))
    .flatMap((mod) =>
      (mod.sidebarItems || []).map((item) => ({
        ...item,
        to: item.to || mod.basePath,
        order: item.order ?? 0,
      }))
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

