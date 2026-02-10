import { test, expect } from "@playwright/test";
import {
  demoValidConfig,
  invalidConfigBaseUrlNotUrl,
  withClientConfig,
} from "./_helpers/config";

// RBAC offensive scenarios: try to bypass guards and access protected modules directly.
test("RBAC: accès direct aux modules sensibles redirige vers Unauthorized", async ({
  page,
}) => {
  await withClientConfig(page, demoValidConfig);

  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: /backoffice bancaire démo/i })
  ).toBeVisible();
  await page.getByLabel(/email/i).waitFor();
  // Sélectionne un profil non-admin dans le formulaire de login.
  await page
    .getByLabel(/profil de démo/i)
    .selectOption("agent-agence");
  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  // Tentative d'accès direct à Users & Roles
  await page.goto("/users-roles");
  // Suivant la configuration, un accès illégitime peut se traduire
  // soit par une page "Accès refusé", soit par une 404 contrôlée.
  await expect(page.locator("body")).toContainText(
    /accès refusé|page non trouvée/i
  );

  // Tentative d'accès direct à Audit
  await page.goto("/audit");
  await expect(page.locator("body")).toContainText(
    /accès refusé|page non trouvée/i
  );
});

// Config abuse scenarios: inject a malicious/invalid client.config.json and
// ensure the app fails gracefully with a controlled error UI.
test("Config: client.config.json invalide affiche une page de configuration invalide", async ({
  page,
}) => {
  // Config volontairement invalide (api.baseUrl non-URL)
  await withClientConfig(page, invalidConfigBaseUrlNotUrl);

  await page.goto("/login");

  // Après chargement de la config invalide, l'application doit afficher
  // une page d'erreur dédiée. On matche sur le texte dans le body pour être
  // plus robuste aux changements de markup.
  await expect(page.locator("body")).toContainText(/configuration invalide/i, {
    timeout: 15000,
  });
  await expect(page.locator("body")).toContainText(/client.config.json/i, {
    timeout: 15000,
  });
});

