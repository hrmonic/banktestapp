import { test, expect } from "@playwright/test";
import { demoValidConfig, withClientConfig } from "./_helpers/config";

test("login et accès au dashboard (admin par défaut)", async ({ page }) => {
  // Fournit une configuration de démo stable pour éviter toute dépendance
  // à un fichier client.config.json externe pendant les tests.
  await withClientConfig(page, demoValidConfig);

  // Va directement sur la page de login pour éviter toute ambiguïté de routing.
  await page.goto("/login");

  // Attend explicitement que le formulaire de login soit prêt.
  await page.getByLabel(/email/i).waitFor();

  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  await expect(page.getByText(/dashboard/i)).toBeVisible();
});

test("navigation entre modules activés pour un admin", async ({ page }) => {
  await withClientConfig(page, demoValidConfig);

  await page.goto("/login");

  await page.getByLabel(/email/i).waitFor();
  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  // Accès au module Transactions via la sidebar
  await page.getByRole("link", { name: /transactions/i }).click();
  await expect(
    page.getByRole("heading", { name: /historique des transactions/i })
  ).toBeVisible();
});

test("un utilisateur sans rôle admin ne voit pas Users & Roles", async ({
  page,
}) => {
  await withClientConfig(page, demoValidConfig);

  await page.goto("/login");

  await page.getByLabel(/email/i).waitFor();
  // Choisit explicitement un profil non-admin via le sélecteur de la page.
  await page
    .getByLabel(/profil de démo/i)
    .selectOption("agent-agence");
  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  await expect(page.getByText(/dashboard/i)).toBeVisible();
  // Le lien Users & Roles ne doit pas être présent pour un user standard
  await expect(
    page.getByRole("link", { name: /users & roles/i })
  ).toHaveCount(0);
});

