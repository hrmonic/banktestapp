import { moduleRegistry } from "../src/modules/registry.js";

describe("moduleRegistry", () => {
  afterEach(() => {
    // @ts-ignore - internal detail reset for tests only
    moduleRegistry.initialized = false;
    // @ts-ignore
    moduleRegistry.modules = {};
    // @ts-ignore
    moduleRegistry.enabledModules = [];
  });

  it("active tous les modules par défaut quand aucune config n’est fournie", () => {
    const modules = moduleRegistry.getEnabledModules();
    expect(modules.length).toBeGreaterThan(0);
  });

  it("respecte la config modules.{id}.enabled", () => {
    const config = {
      modules: {
        dashboard: { enabled: true },
        accounts: { enabled: false },
      },
    };

    const modules = moduleRegistry.getEnabledModules(config);
    const ids = modules.map((mod) => mod.id);

    expect(ids).toContain("dashboard");
    expect(ids).not.toContain("accounts");
  });
});


