#!/usr/bin/env node

// Simple module generator for apps/starter.
// Usage: pnpm generate:module my-module-id

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

function toPascalCase(id) {
  return id
    .split(/[-_]/g)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function main() {
  const [, , rawName] = process.argv;
  if (!rawName) {
    console.error("Usage: pnpm generate:module <module-id>");
    process.exit(1);
  }

  const moduleId = rawName.toLowerCase();
  const moduleDir = join(
    __dirname,
    "..",
    "apps",
    "starter",
    "src",
    "modules",
    moduleId,
  );
  const testsDir = join(
    __dirname,
    "..",
    "apps",
    "starter",
    "tests",
    "modules",
  );

  if (existsSync(moduleDir)) {
    console.error(`Module directory already exists: ${moduleDir}`);
    process.exit(1);
  }

  mkdirSync(moduleDir, { recursive: true });
  mkdirSync(testsDir, { recursive: true });

  const pascalName = toPascalCase(moduleId);

  const moduleJsx = `import React from "react";
import { Routes, Route } from "react-router-dom";
import { Card } from "@bank/ui";

function ${pascalName}Home() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold mb-1">${pascalName}</h1>
        <p className="text-sm text-slate-600">
          Module généré automatiquement. Remplacez ce contenu par votre vue métier.
        </p>
      </header>
      <Card>
        <p className="text-sm text-slate-600">
          Contenu de démonstration pour le module <code>${moduleId}</code>.
        </p>
      </Card>
    </div>
  );
}

function ${pascalName}Routes() {
  return (
    <Routes>
      <Route index element={<${pascalName}Home />} />
    </Routes>
  );
}

/** @type {import("../types.d.js").BankModule} */
const ${moduleId}Module = {
  id: "${moduleId}",
  name: "${pascalName}",
  basePath: "/${moduleId}",
  routes: ${pascalName}Routes,
  sidebarItems: [{ label: "${pascalName}", to: "/${moduleId}", order: 99 }],
  permissionsRequired: [],
};

export default ${moduleId}Module;
`;

  const barrelJs = `// Barrel file sans JSX pour simplifier l'analyse par Vite.
export * from "./module.jsx";
export { default } from "./module.jsx";
`;

  const testFile = `import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import generatedModule from "../../src/modules/${moduleId}/module.js";

describe("${moduleId} module", () => {
  it("rend la page d'accueil du module généré", () => {
    const RoutesComponent = generatedModule.routes;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutesComponent />} />
        </Routes>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/${pascalName}/i)
    ).toBeInTheDocument();
  });
});
`;

  writeFileSync(join(moduleDir, "module.jsx"), moduleJsx, "utf-8");
  writeFileSync(join(moduleDir, "module.js"), barrelJs, "utf-8");
  writeFileSync(
    join(testsDir, `${pascalName}Module.test.jsx`),
    testFile,
    "utf-8",
  );

  console.log(`Module "${moduleId}" generated at ${moduleDir}`);
  console.log(
    `Remember to add "${moduleId}" to the module registry and client.config.json if needed.`,
  );
}

main();

