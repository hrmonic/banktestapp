import { test, expect } from "@playwright/test";

test("login et accès au dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /backoffice bancaire démo/i })).toBeVisible();

  await page.getByLabel(/email/i).fill("demo@bank.test");
  await page.getByLabel(/mot de passe/i).fill("password");
  await page.getByRole("button", { name: /se connecter/i }).click();

  await expect(page.getByText(/dashboard/i)).toBeVisible();
});


