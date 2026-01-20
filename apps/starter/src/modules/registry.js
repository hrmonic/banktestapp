import dashboard from "./dashboard/module.js";
import accounts from "./accounts/module.js";
import transactions from "./transactions/module.js";
import approvals from "./approvals/module.js";
import usersRoles from "./users-roles/module.js";
import reports from "./reports/module.js";
import audit from "./audit/module.js";

class ModuleRegistry {
  constructor() {
    this.modules = {};
    this.enabledModules = [];
    this.initialized = false;
  }
  /**
   * Initialize the registry with all known modules and compute
   * the list of enabled modules based on client configuration.
   *
   * Expected config shape (see client.config.json):
   * {
   *   modules: {
   *     "dashboard": { enabled: true },
   *     "transactions": { enabled: false },
   *     ...
   *   }
   * }
   */
  initialize(config) {
    if (this.initialized) return;
    this.modules = {
      dashboard,
      accounts,
      transactions,
      approvals,
      "users-roles": usersRoles,
      reports,
      audit,
    };

    const modulesConfig = config?.modules;
    // If no config is provided, enable all known modules by default.
    const enabledIds = modulesConfig
      ? Object.entries(modulesConfig)
          .filter(([, value]) => value?.enabled !== false)
          .map(([id]) => id)
      : Object.keys(this.modules);

    this.enabledModules = enabledIds
      .map((id) => this.modules[id])
      .filter(Boolean);
    this.initialized = true;
  }
  getEnabledModules(config) {
    if (!this.initialized) this.initialize(config);
    return this.enabledModules;
  }
  getAllModules() {
    return Object.values(this.modules);
  }
}

export const moduleRegistry = new ModuleRegistry();
