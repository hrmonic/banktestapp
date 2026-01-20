import { test, expect } from "@playwright/test";

test("login et accès au dashboard (admin par défaut)", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /backoffice bancaire démo/i })
  ).toBeVisible();

  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  await expect(page.getByText(/dashboard/i)).toBeVisible();
});

test("navigation entre modules activés pour un admin", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  // Accès au module Transactions via la sidebar
  await page.getByRole("link", { name: /transactions/i }).click();
  await expect(
    page.getByRole("heading", { name: /historique des transactions/i })
  ).toBeVisible();
});

test("un utilisateur sans rôle admin ne voit pas Users & Roles", async ({ page }) => {
  // Simule un rôle \"user\" pour la démo RBAC
  await page.addInitScript(() => {
    window.localStorage.setItem("demo-role", "user");
  });

  await page.goto("/");

  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  await expect(page.getByText(/dashboard/i)).toBeVisible();
  // Le lien Users & Roles ne doit pas être présent pour un user standard
  await expect(
    page.getByRole("link", { name: /users & roles/i })
  ).toHaveCount(0);
});

