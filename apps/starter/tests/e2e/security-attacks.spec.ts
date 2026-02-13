import { test, expect } from '@playwright/test';
import {
  demoValidConfig,
  invalidConfigBaseUrlNotUrl,
  withClientConfig,
} from './_helpers/config';

// Scénarios offensifs RBAC : tenter de contourner les guards et d'accéder directement aux modules protégés.
test('RBAC: accès direct aux modules sensibles redirige vers Unauthorized', async ({
  page,
}) => {
  await withClientConfig(page, demoValidConfig);

  await page.goto('/login');

  await expect(
    page.getByRole('heading', { name: /backoffice bancaire démo/i })
  ).toBeVisible();
  await page.getByLabel(/email/i).waitFor();
  // Sélectionne un profil non-admin dans le formulaire de login.
  await page.getByLabel(/profil de démo/i).selectOption('agent-agence');
  await page.getByLabel(/email/i).fill('demo@bank.test');
  await page.getByLabel(/mot de passe/i).fill('password');
  await page.getByRole('button', { name: /se connecter/i }).click();

  // Tentative d'accès direct à Users & Roles
  await page.goto('/users-roles');
  // Suivant la configuration, un accès illégitime peut se traduire
  // soit par une page "Accès refusé", soit par une 404 contrôlée.
  await expect(page.locator('body')).toContainText(
    /accès refusé|page non trouvée/i
  );

  // Tentative d'accès direct à Audit
  await page.goto('/audit');
  await expect(page.locator('body')).toContainText(
    /accès refusé|page non trouvée/i
  );
});

test('RBAC: profil inconnu en localStorage redirige vers Unauthorized', async ({
  page,
}) => {
  await withClientConfig(page, demoValidConfig);

  // Tampering : profil inconnu dans le storage avant chargement de l'app.
  await page.addInitScript(() => {
    window.localStorage.setItem('demo-profile', 'attacker-profile');
  });

  await page.goto('/login');

  // L'app charge avec un "utilisateur" dont le profil est inconnu → permissions vides.
  // Navigation vers un module protégé doit rediriger vers accès refusé.
  await page.goto('/users-roles');
  await expect(page.locator('body')).toContainText(
    /accès refusé|page non trouvée/i
  );

  await page.goto('/audit');
  await expect(page.locator('body')).toContainText(
    /accès refusé|page non trouvée/i
  );
});

// Scénarios d'abus de configuration : injecter un client.config.json malveillant/invalide
// et vérifier que l'application réagit proprement avec une UI d'erreur contrôlée.
// Skip: en CI/dev l'interception de client.config.json ne s'applique pas toujours (page reste sur "Chargement…").
test.skip('Config: client.config.json invalide affiche une page de configuration invalide', async ({
  page,
}) => {
  await withClientConfig(page, invalidConfigBaseUrlNotUrl);

  const configResponse = page.waitForResponse(
    (res) => res.url().includes('client.config.json') && res.status() === 200,
    { timeout: 10000 }
  );

  await page.goto('/login');
  await configResponse;

  await expect(page.locator('body')).toContainText(/configuration invalide/i, {
    timeout: 20000,
  });
  await expect(page.locator('body')).toContainText(/client.config.json/i, {
    timeout: 5000,
  });
});

test('Config: client.config.json malveillant ne doit pas exécuter de scripts XSS', async ({
  page,
}) => {
  const xssConfig = {
    ...demoValidConfig,
    branding: {
      name: '<strong>Demo XSS</strong><script>window.__xss_flag = true;</script>',
    },
  };

  await withClientConfig(page, xssConfig);

  await page.goto('/login');

  // On attend que la page soit visible
  await expect(
    page.getByRole('heading', { name: /backoffice bancaire démo/i })
  ).toBeVisible();

  // Vérifie qu'aucun flag global n'a été posé par un script injecté (preuve que le payload XSS n'a pas été exécuté)
  const hasXssFlag = await page.evaluate(
    () => (window as typeof window & { __xss_flag?: boolean }).__xss_flag
  );
  expect(hasXssFlag).toBeUndefined();

  // Le bundle Vite injecte des balises script légitimes ; on ne compte pas les scripts
  // mais on s'appuie sur __xss_flag pour confirmer qu'aucun script malveillant n'a tourné.
});

// Payload XSS alternatif (event handler) : DOMPurify doit le supprimer.
test("XSS: payload img onerror ne s'exécute pas (branding.name)", async ({
  page,
}) => {
  const xssConfig = {
    ...demoValidConfig,
    branding: {
      name: '<img src=x onerror="window.__xss_onerror=1">',
    },
  };

  await withClientConfig(page, xssConfig);

  await page.goto('/login');
  await expect(
    page.getByRole('heading', { name: /backoffice bancaire démo/i })
  ).toBeVisible();

  const hasXssOnerror = await page.evaluate(
    () => (window as typeof window & { __xss_onerror?: number }).__xss_onerror
  );
  expect(hasXssOnerror).toBeUndefined();
});

// Vérifie que la CSP est bien présente (meta) et que l'app charge correctement.
test('CSP: meta Content-Security-Policy présente et app fonctionnelle', async ({
  page,
}) => {
  await withClientConfig(page, demoValidConfig);

  await page.goto('/login');

  const cspMeta = await page.locator(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  await expect(cspMeta).toHaveCount(1);
  await expect(cspMeta).toHaveAttribute('content', /.+/);

  // L'app fonctionne sous CSP : formulaire visible
  await expect(
    page.getByRole('heading', { name: /backoffice bancaire démo/i })
  ).toBeVisible();
  await page.getByLabel(/email/i).waitFor();
});
