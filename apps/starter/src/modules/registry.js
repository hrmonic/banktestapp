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
    const enabled = config?.modules?.enabled || Object.keys(this.modules);
    this.enabledModules = enabled.map((id) => this.modules[id]).filter(Boolean);
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
