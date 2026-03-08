# Modular BankUI Studio – Suite Front-end Bancaire Modulaire

<div align="center">

**Suite front-end modulaire, brandable et accessible pour back-offices bancaires.**

> UI/UX only – aucune logique métier ou persistance côté repo, tout passe par vos APIs.

[![CI](https://github.com/hrmonic/banktestapp/actions/workflows/ci.yml/badge.svg)](https://github.com/hrmonic/banktestapp/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-Voir%20la%20d%C3%A9mo-green?style=for-the-badge)](https://banktestapp-demo.vercel.app)
[![Node.js](https://img.shields.io/badge/node-%E2%89%A518.0.0-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)

[🔧 Démarrage rapide](#-démarrage-rapide) • [🏗 Architecture](#-architecture-du-projet) • [🛡 Sécurité](#-sécurité) • [🧪 Tests & qualité](#-tests--qualité) • [📚 Documentation](#-documentation)

</div>

---

## Aperçu produit

Captures des écrans clés (dashboard, liste). Ajoutez vos captures dans `docs/screenshots/` et décommentez les lignes ci‑dessous.

<!--
![Dashboard](docs/screenshots/dashboard.png)
![Liste](docs/screenshots/list.png)
-->

*Après déploiement de la démo : [Voir la démo live](https://banktestapp-demo.vercel.app) (mettre à jour l’URL dans le README après déploiement sur Vercel/Netlify).*

---

## Pour les recruteurs (en 20 secondes)

Ce que vous voyez tout de suite :

- **CI verte** : [Actions](https://github.com/hrmonic/banktestapp/actions) (build + lint + tests unitaires + tests sécurité).
- **Démo live** : [Voir la démo](https://banktestapp-demo.vercel.app) (à configurer une fois déployée ; voir [docs/deploy-demo.md](docs/deploy-demo.md)).
- **Monorepo front** : `apps/starter` (app de démo) + `packages/ui` (@bank/ui), config validée (Zod), RBAC.
- **Tests** : `pnpm test` (Vitest), `pnpm test:e2e` (Playwright), `pnpm test:security` (RBAC, sanitize, adversarial).
- **Doc** : architecture, sécurité, contrats API, a11y dans `docs/` et `docs/en/` / `docs/fr/`.

---

## ✨ Highlights for reviewers

- **100% TypeScript** – app, packages et tests en TypeScript pour la maintenabilité et la sécurité des types.
- **Architecture modulaire** : modules métier (Dashboard, Transactions, Accounts, Approvals, Users & Roles, Reports, Audit) enregistrés dans un registry central, activés et filtrés par la config client et le RBAC.
- **Configuration validée** : `client.config.json` validé au chargement via **Zod** (`configSchema.ts`) ; en cas d’erreur, affichage d’une page dédiée (InvalidConfigPage) sans exécuter l’app.
- **UI kit réutilisable** : `@bank/ui` (Button, Card, PageLayout, VirtualizedList) partagé et versionnable.
- **Sécurité renforcée** : voir [Sécurité](#-sécurité) ci‑dessous (apiClient durci, sanitization, RBAC, session, CSP, playbook d’incident).
- **Tests exigeants** : Vitest (unitaires, composants, registry, config, **RBAC**, **SafeHtml**, **sanitizeHtml**, **tests adversariaux apiClient**), Playwright (E2E + **scénarios sécurité**), tests a11y (axe-core), `pnpm test:security`.

La documentation détaillée (architecture, sécurité, contrats API, accessibilité) est dans `docs/` et dans `docs/en/` / `docs/fr/`.

---

## 📖 About (English overview)

**Modular BankUI Studio** is a front-end only, modular backoffice UI for banking use cases.

- **100% front-end** – no backend in this repo; you plug in your own APIs.
- **Modular** – enable/disable modules (dashboard, transactions, accounts, approvals, audit, users & roles, reports) via `client.config.json`; registry + RBAC control routes and sidebar.
- **Config validated** – client config is validated with Zod at startup; invalid config shows a dedicated error page.
- **Brandable** – per-client theming (logo, palette, design tokens, themeKey).
- **Enterprise-ready** – RBAC with permission guards, session timeout, tokens in memory only, sanitization of rich content, CSP-friendly design, security hardening doc and incident playbook.

---

## 📖 À propos (FR)

**Modular BankUI Studio** est une suite front-end prête à l’emploi pour construire des interfaces internes bancaires (back-office, middle-office, outils de contrôle).

- **100% front-end** : aucun backend embarqué, intégration via vos APIs.
- **Modulaire** : activation des modules par config ; registry et RBAC pour les routes et la navigation.
- **Config validée** : `client.config.json` validé au chargement (Zod) ; page d’erreur dédiée si invalide.
- **Brandable** : theming par client (logo, palette, tokens, thème).
- **Enterprise-ready** : RBAC, timeout de session, tokens en mémoire uniquement, sanitization du contenu riche, conception CSP-friendly, documentation de durcissement et playbook d’incident.

### 🎯 Pourquoi l’utiliser ?

| Fonctionnalité                  | Bénéfice                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| ⚡ **Suite prête à l’emploi**   | Démarrez un back-office bancaire complet en quelques heures                               |
| 🧩 **Modules plug-and-play**    | Activez uniquement les modules nécessaires par client/projet                              |
| 🛡 **Sécurité front renforcée** | Validation config, apiClient durci, sanitization, RBAC, session, pas de PII dans les logs |
| 🎨 **Branding par client**      | Logo, couleurs, tokens de thème surchargeables                                            |
| ♿ **Accessibilité**            | Composants visant WCAG 2.1 AA, checklist a11y dans la doc                                 |
| 📦 **UI package réutilisable**  | `@bank/ui` packagé, versionnable et publiable sur npm/registry privé                      |

---

## 🚀 Démarrage rapide

### 📋 Prérequis

- **Node.js** ≥ 18
- **pnpm** recommandé (support npm/yarn possible avec adaptation des scripts)
- Navigateurs evergreen (Chrome, Firefox, Safari, Edge)

### ⚡ Installation & build

```bash
pnpm install
pnpm build
```

### 🎬 Développement

```bash
pnpm dev                    # App de démo (apps/starter)
pnpm test                   # Tests unitaires / intégration (Vitest)
pnpm test:e2e               # Tests E2E (Playwright)
pnpm test:security          # Tests sécurité (RBAC, adversarial, sanitize, SafeHtml)
pnpm generate:module my-id  # Générer un module conforme au contrat BankModule
pnpm lint                   # ESLint
pnpm format                 # Prettier
```

L’application de démo (`apps/starter`) expose les modules (dashboard, transactions, accounts, approvals, users-roles, reports, audit) et sert de base d’intégration.

---

## 🏗 Architecture du projet

- **ConfigGate** : au démarrage, charge `public/client.config.json` et le valide avec le schéma Zod (`lib/configSchema.ts`). Si la config est invalide, affichage de `InvalidConfigPage` ; sinon, l’app monte avec `ConfigProvider` et les autres providers (Auth, notifications, thème).
- **Registry** (`modules/registry.ts`) : centralise les modules, expose `getEnabledModules(config)`, `getSidebarItems(config, userPermissions)`, `canAccessModule(module, permissions)`. Chaque module respecte le contrat `BankModule` (id, name, basePath, routes, sidebarItems, permissionsRequired, featureFlags).
- **Séparation** : `core/` (types, constantes), `lib/adapters/` (appels API par module), `lib/api/` (apiClient, erreurs), `lib/auth/` (démo / OIDC, memoryStore pour tokens), `lib/config/`, `lib/security/` (RBAC, sanitizeHtml, SafeHtml), `lib/theme/`, `components/`, `pages/`.

Structure simplifiée :

```text
banktestapp-main/
├── apps/starter/
│   ├── src/
│   │   ├── App.tsx, main.tsx
│   │   ├── core/           # types, constantes
│   │   ├── components/     # AppShell, ErrorBoundary, SessionTimeout*, Theme*, etc.
│   │   ├── lib/            # adapters, api, auth, config, security, theme
│   │   ├── modules/        # registry + dashboard, accounts, transactions, approvals, users-roles, reports, audit
│   │   └── pages/          # Login, LoginCallback, NotFound, Unauthorized, InvalidConfig, NoModules
│   └── public/client.config.json
├── packages/ui/            # @bank/ui (Button, Card, PageLayout, VirtualizedList)
├── docs/                   # architecture, security-hardening, incident playbook, api-contracts, a11y checklist
└── docs/en/, docs/fr/      # Documentation utilisateur et technique
```

Pour le détail (flux, contrat BankModule, config, responsabilités), voir **`docs/architecture.md`**.

---

## ⚙ Configuration client

Fichier `public/client.config.json` : `branding`, `themeKey`, `modules` (enabled, exportEnabled par module), `api` (baseUrl, timeout), `auth` (type, issuer, clientId, mode demo/oidc), `session` (idleTimeoutMinutes, warningBeforeLogoutSeconds). La config est validée au chargement ; les adaptateurs d’API par module sont configurables (voir `docs/api-contracts.md` et les adaptateurs dans `lib/adapters/`).

---

## 📊 Modules disponibles

- **Dashboard** : KPIs, widgets par rôle, graphiques (MiniLineChart, MiniBarChart, TrendIndicator), activité récente.
- **Accounts** : liste et détail des comptes, export CSV, fil d’Ariane.
- **Transactions** : liste paginée, filtres, approbation/rejet, export.
- **Approvals** : demandes d’approbation, workflow approve/reject avec motif.
- **Users & Roles** : gestion des rôles et permissions (RBAC), intégration IAM/OIDC possible.
- **Reports** : liste des rapports, téléchargement (PDF/XLSX).
- **Audit** : logs d’activité, traçabilité par ressource/module/action, vue filtrable.

---

## 🛡 Sécurité

La sécurité métier et la conformité réglementaire (KYC/AML, etc.) restent côté backend. Cette suite applique des bonnes pratiques front et est conçue pour s’intégrer à un environnement durci.

### Configuration

- **Validation stricte** : `client.config.json` est validé au chargement via le schéma Zod (`configSchema.ts`). Une config invalide ou malformée empêche le démarrage de l’app et affiche une page dédiée (InvalidConfigPage).

### Réseau et apiClient

- **apiClient** (`lib/api/apiClient.ts`) : rejet des URLs absolues vers d’autres origines, des URLs protocol-relative (`//evil.com`), des schémas dangereux (`javascript:`, `vbscript:`, `file:`, `blob:`), et des chemins contenant `:` pour limiter les risques d’injection et de SSRF. Ces contrôles sont couverts par des **tests adversariaux** (`tests/security/adversarial.test.ts`).

### Contenu et XSS

- **sanitizeHtml** (`lib/security/sanitizeHtml.ts`) : nettoyage du HTML issu de la config ou d’autres sources externes (DOMPurify) ; pas d’injection de script via le contenu riche. Tests dédiés dans `tests/security/sanitizeHtml.test.ts`.
- **SafeHtml** (`lib/security/SafeHtml.tsx`) : composant qui rend du contenu passé par la sanitization. Tests dans `tests/security/SafeHtml.test.tsx`.

### Autorisation (RBAC)

- **Guards** : routes et sidebar sont filtrées selon les permissions utilisateur (`permissionsRequired` par module, `profilePermissions` par profil, `getSidebarItems`, `canAccessModule`). Les parcours E2E incluent des scénarios de **sécurité** (accès refusé, sidebar selon profil) ; voir `tests/e2e/security-attacks.spec.ts` et `pnpm test:security`.

### Session et tokens

- **Tokens en mémoire uniquement** par défaut (OIDC : `memoryStore` pour oidc-client-ts ; pas de persistance longue des tokens sensibles).
- **Timeout de session** : inactivité configurable (`session.idleTimeoutMinutes`, `session.warningBeforeLogoutSeconds`) avec modal d’avertissement puis déconnexion automatique (`SessionTimeoutWrapper`).

### Logs et PII

- **Pas de PII** dans les logs front par défaut (logger dédié, pas de stack ni d’infos utilisateur dans les messages envoyés).

### CSP et déploiement

- **CSP-friendly** : conception compatible avec des politiques Content-Security-Policy strictes. Une meta CSP minimale est présente dans `index.html` ; pour un durcissement en production (nonces, gateway), voir **`docs/security-hardening.md`** (en-têtes HTTP recommandés, intégration derrière une gateway).
- **Playbook d’incident** : **`docs/security-incident-playbook.md`** décrit les actions en cas de PII dans les logs, désactivation urgente d’un module, erreurs critiques, et post-mortem.

Pour une checklist d’intégration sécurisée et le positionnement démo vs production, voir **`docs/en/security-compliance.md`** (et `docs/fr/`).

---

## ♿ Accessibilité

- **WCAG 2.1 AA** visée sur les composants clés ; navigation clavier, focus visible, attributs ARIA appropriés, contrastes vérifiés.
- **Checklist a11y** pour `@bank/ui` : **`docs/ui-accessibility-checklist.md`**.
- Tests a11y avec **axe-core** sur des écrans cibles (dashboard, transactions, users-roles, login) dans `tests/a11y/`.

---

## ⚡ Performance

- Code splitting par module, virtualisation des listes (`VirtualizedList`), lazy loading des vues lourdes. Cache et stratégies d’API à brancher selon votre stack (ex. React Query).

---

## 🧪 Tests & qualité

- **Vitest + Testing Library** : bootstrap de l’app, registry et activation des modules, config client (dont fuzz), RBAC (sidebar par profil, RequirePermission), **SafeHtml**, **sanitizeHtml**, **apiClient (tests adversariaux)** ; tests par module (rendu, erreurs, chemins critiques). MSW pour mocker les appels HTTP.
- **Playwright** : E2E (login, dashboard, navigation) et **scénarios sécurité** (attaques, accès refusé, sidebar selon profil).
- **Tests a11y** : axe-core sur des pages cibles (wcag2a, wcag2aa).
- **Script dédié** : `pnpm test:security` exécute la suite des tests sécurité (RBAC, adversarial, sanitize, SafeHtml, config-and-rbac).
- **ESLint + Prettier** : appliqués en CI (`pnpm lint`, `pnpm format` / `pnpm format:check`).

Détails et bonnes pratiques : **`docs/en/testing-and-quality.md`** (et `docs/fr/`).

---

## 🚀 Déploiement

Build production : `pnpm build`. Servir le dossier `apps/starter/dist/` derrière votre reverse-proxy / gateway. Pour le durcissement (CSP, HSTS, etc.), voir **`docs/security-hardening.md`**. Intégration client : installer `@bank/ui`, utiliser `apps/starter` comme base, configurer `client.config.json`, surcharger les adaptateurs et le thème selon besoin.

---

## 📚 Documentation

| Document                                 | Description                                                                                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`docs/architecture.md`**               | Architecture détaillée : structure, flux, BankModule, config, sécurité (résumé), tests.                                                                     |
| **`docs/deploy-demo.md`**                | Déploiement de la démo (Vercel, Netlify, GitHub Pages) et mise à jour de l’URL dans le README.                                                              |
| **`docs/security-hardening.md`**         | En-têtes HTTP (CSP, HSTS, etc.), intégration gateway, tokens/session, durcissement de la config.                                                            |
| **`docs/security-incident-playbook.md`** | Actions en cas d’incident (PII dans les logs, désactivation de module, erreurs critiques, post-mortem).                                                     |
| **`docs/api-contracts.md`**              | Contrats des endpoints attendus (accounts, dashboard, transactions, approvals, users-roles, audit, reports).                                                |
| **`docs/ui-accessibility-checklist.md`** | Checklist accessibilité par composant `@bank/ui`.                                                                                                           |
| **`docs/en/`**                           | Documentation EN : overview, getting-started, architecture, modules, configuration, security-compliance, testing-and-quality, enterprise-integration-guide. |
| **`docs/fr/`**                           | Même structure en français.                                                                                                                                 |

Recommandation : commencer par `docs/en/overview.md` ou `docs/fr/overview.md`, puis `getting-started.md` et `architecture.md`.

---

## 📌 Roadmap

- [x] Modules de base : Dashboard, Transactions, Accounts, Approvals, Users & Roles, Reports, Audit
- [x] 100 % TypeScript, config validée (Zod), session timeout, thèmes
- [x] Sécurité renforcée : apiClient durci, sanitization, RBAC, tests adversariaux et E2E sécurité
- [x] Packaging `@bank/ui`, documentation architecture et sécurité
- [ ] Mode sombre global, catalogues de thèmes par client
- [ ] Charts bancaires préconfigurés, générateurs de modules template

---

## 📄 Licence

Ce projet est distribué sous une licence de type **MIT modifiée** : usage non-commercial selon les termes MIT ; **tout usage commercial nécessite une autorisation écrite préalable**. Voir le fichier `LICENSE` pour le détail.
