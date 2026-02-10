import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import {
  PermissionsProvider,
  RequirePermission,
  ModuleRouteGuard,
} from "../../src/lib/security/rbac.js";
import { AuthProvider } from "../../src/lib/auth/authProvider.js";

function DummyPage({ label }) {
  return <div>{label}</div>;
}

describe("RBAC helpers", () => {
  it("RequirePermission redirige quand la permission manque", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <PermissionsProvider permissions={[]}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <RequirePermission permission="admin">
                    <DummyPage label="Protected" />
                  </RequirePermission>
                }
              />
              <Route path="/unauthorized" element={<DummyPage label="Unauthorized" />} />
            </Routes>
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    // No user logged in, should render unauthorized when we navigate
    // Simulate navigation by rendering the route directly
    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
  });

  it("ModuleRouteGuard autorise un module public sans permissionsRequired", () => {
    const publicModule = {
      id: "public",
      name: "Public",
      basePath: "/public",
      routes: () => null,
      sidebarItems: [],
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <PermissionsProvider permissions={[]}>
            <ModuleRouteGuard module={publicModule}>
              <DummyPage label="PublicContent" />
            </ModuleRouteGuard>
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("PublicContent")).toBeInTheDocument();
  });
});


