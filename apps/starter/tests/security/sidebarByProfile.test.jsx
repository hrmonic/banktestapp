import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { getSidebarItems } from "../../src/modules/registry.js";
import { PROFILE_IDS, getPermissionsForProfile } from "../../src/lib/security/profilePermissions.js";
import { AppShell } from "../../src/components/layout/AppShell.jsx";
import { AuthProvider } from "../../src/lib/auth/authProvider.jsx";

// Simple smoke test to ensure sidebar items differ by profile.

function renderWithProfile(profile) {
  const permissions = getPermissionsForProfile(profile);

  // We don't need to render the full AppShell tree; getSidebarItems is pure.
  const items = getSidebarItems(
    {
      modules: {
        dashboard: { enabled: true },
        accounts: { enabled: true },
        transactions: { enabled: true },
        approvals: { enabled: true },
        "users-roles": { enabled: true },
        reports: { enabled: true },
        audit: { enabled: true },
      },
    },
    permissions
  );

  return items;
}

describe("sidebar by profile", () => {
  it("montre un sous-ensemble de modules pour l’agent d’agence", () => {
    const items = renderWithProfile(PROFILE_IDS.AGENT);
    const labels = items.map((item) => item.label);
    expect(labels).toContain("Dashboard");
    expect(labels).toContain("Accounts");
    expect(labels).not.toContain("Users & Roles");
  });

  it("inclut Users & Roles pour l’admin backoffice", () => {
    const items = renderWithProfile(PROFILE_IDS.ADMIN);
    const labels = items.map((item) => item.label);
    expect(labels).toContain("Users & Roles");
  });
});


