import { describe, it, expect } from "vitest";
import {
  clientConfigSchema,
  parseClientConfig,
} from "../../src/lib/configSchema.js";

const validConfig = {
  branding: {
    name: "Demo Bank",
    logo: "/logo.svg",
    primaryColor: "#0055ff",
  },
  modules: {
    dashboard: { enabled: true },
    accounts: { enabled: true },
  },
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000,
  },
  auth: {
    type: "oidc",
    issuer: "https://idp.example.com",
    clientId: "demo-client-id",
  },
};

describe("clientConfig validation", () => {
  it("accepts a valid configuration", () => {
    const parsed = parseClientConfig(validConfig);
    expect(parsed.branding.name).toBe("Demo Bank");
  });

  it("rejects configuration with missing branding name", () => {
    const invalid = {
      ...validConfig,
      branding: { ...validConfig.branding, name: "" },
    };

    expect(() => parseClientConfig(invalid)).toThrowError();
  });

  it("rejects configuration with invalid api.baseUrl", () => {
    const invalid = {
      ...validConfig,
      api: { ...validConfig.api, baseUrl: "not-a-url" },
    };

    expect(() => parseClientConfig(invalid)).toThrowError();
  });

  it("has a schema type that matches the sample config", () => {
    const result = clientConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });
});

