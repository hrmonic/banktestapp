# Modular BankUI Studio – Suite Front-end Bancaire Modulaire

<div align="center">

**Suite front-end modulaire, brandable et accessible pour back-offices bancaires.**

> UI/UX only – aucune logique métier ou persistance côté repo, tout passe par vos APIs.

[![Node.js](https://img.shields.io/badge/node-%E2%89%A518.0.0-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)

[🔧 Démarrage rapide](#-démarrage-rapide) • [🏗 Architecture](#-architecture-du-projet) • [📊 Modules](#-modules-disponibles) • [🛡 Sécurité](#-sécurité) • [♿ Accessibilité](#-accessibilité) • [🚀 Déploiement](#-déploiement)

</div>

---

## 📖 À propos

**Modular BankUI Studio** est une suite front-end prête à l’emploi pour construire des interfaces internes bancaires (back-office, middle-office, outils de contrôle) sans réinventer l’UI à chaque client.

- **100% front-end** : aucun backend embarqué, intégration via vos propres APIs.
- **Modulaire** : activer/désactiver les modules (dashboard, transactions, audit, users & roles, etc.).
- **Brandable** : theming avancé par client (logo, palette, tokens de design).
- **Enterprise-ready** : RBAC, audit, performance, accessibilité WCAG 2.1 AA.

### 🎯 Pourquoi l’utiliser ?

| Fonctionnalité | Bénéfice |
| ------------- | -------- |
| ⚡ **Suite prête à l’emploi** | Démarrez un back-office bancaire complet en quelques heures |
| 🧩 **Modules plug-and-play** | Activez uniquement les modules nécessaires par client/projet |
| 🛡 **RBAC & sécurité front** | Guards par rôle, pas de PII dans les logs, CSP-friendly |
| 🎨 **Branding par client** | Logo, couleurs, tokens de thème facilement surchargés |
| ♿ **Accessibilité** | Composants conformes WCAG 2.1 AA, navigation clavier complète |
| 📦 **UI package réutilisable** | `@bank/ui` packagé, versionnable et publiable sur npm/registry privé |

---

## 🚀 Démarrage rapide

### 📋 Prérequis

- **Node.js** ≥ 18
- **pnpm** recommandé (support npm/yarn possible avec adaptation des scripts)
- Navigateurs evergreen (Chrome, Firefox, Safari, Edge)

### ⚡ Installation & build

```bash
# Installer les dépendances
pnpm install

# Build complet (UI + apps)
pnpm build
```

### 🎬 Développement

```bash
# Démarrer l’app de démo (apps/starter)
pnpm dev

# Tests unitaires / intégration
pnpm test

# Tests end-to-end (Playwright, si configuré)
pnpm test:e2e

# Build tous les packages
pnpm build

# Build du UI package uniquement
pnpm -F @bank/ui build
```

L’application de démo (`apps/starter`) expose les principaux modules (dashboard, transactions, audit, users & roles) et sert de base d’intégration client.

---

## 🏗 Architecture du projet

Structure simplifiée :

```text
banktestapp-main/
├── apps/
│   └── starter/            # Application de démonstration & intégration
│       ├── src/
│       │   ├── pages/      # Login, 404, Unauthorized, etc.
│       │   ├── modules/    # Modules métier (transactions, dashboard, etc.)
│       │   ├── components/ # Layout, ErrorBoundary, Loading, etc.
│       │   └── lib/        # Auth, sécurité, config client
│       └── public/
│           └── client.config.json # Configuration client par environnement
│
├── packages/
│   └── ui/                 # Librairie de composants UI réutilisables (@bank/ui)
│       └── src/
│           └── index.js
│
├── vite.config.ts / vitest.config.mjs / playwright.config.ts
└── package.json / pnpm-workspace.yaml
```

### 🔄 Flux de données (vue d’ensemble)

1. L’utilisateur se connecte via le `LoginPage` (auth provider configurable).
2. `client.config.json` est chargé depuis `public/` pour déterminer branding + modules + endpoints d’API.
3. Le routeur charge les modules déclarés (`apps/starter/src/modules/*`).
4. Chaque module consomme ses propres adaptateurs d’API (REST/GraphQL ou autre, via `apiClient`).
5. Les composants UI proviennent du package `@bank/ui`.

---

## ⚙ Configuration client

### 1️⃣ Fichier `client.config.json`

Exemple minimal :

```json
{
  "branding": {
    "name": "Ma Banque",
    "logo": "/logo.svg",
    "primaryColor": "#1e40af"
  },
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": false },
    "audit": { "enabled": true }
  },
  "api": {
    "baseUrl": "https://api.mabanque.com",
    "timeout": 8000,
    "auth": {
      "type": "oidc",
      "issuer": "https://auth.mabanque.com",
      "clientId": "backoffice-app"
    }
  }
}
```

### 2️⃣ Adaptateurs d’API (par module)

Chaque module expose un adaptateur configurable, sur lequel vous pouvez surcharger certaines méthodes pour coller à vos conventions d’API :

```javascript
// Adaptateur par défaut (conventions REST génériques)
const transactionsAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};

// Surcharge pour une API spécifique client
const customAdapter = {
  ...transactionsAdapter,
  list: (params) =>
    apiClient.get('/custom/txns', {
      params: mapParamsToCustomFormat(params),
    }),
};
```

---

## 📊 Modules disponibles

### 📈 Dashboard

- Vue d’ensemble des KPIs bancaires.
- Widgets configurables par rôle.
- Filtres temporels et par segment (clients, produits, régions, etc. selon implémentation).

### 💸 Transactions

- Liste paginée avec filtres avancés (date, montant, statut, canal, etc.).
- Approbation en lot avec workflow d’actions (approve / reject / reassign).
- Export CSV/XLSX (via vos APIs ou utilitaires front).

### 👥 Utilisateurs & Rôles

- Gestion des rôles et permissions (RBAC).
- Attribution de permissions fines par module / action.
- Intégration possible avec une IAM/IDP existante (OIDC, SAML, etc. via adaptateurs).

### 📜 Audit (optionnel)

- Logs d’activité utilisateur.
- Traçabilité fine par ressource / module / action.
- Vue filtrable pour investiguer incidents et anomalies.

---

## 🛡 Sécurité

- **Tokens en mémoire uniquement** (pas de stockage long terme par défaut).
- **CSP-friendly** : fonctionnement compatible avec des politiques de Content Security Policy strictes.
- **RBAC** : guards sur routes et composants en fonction des rôles/permissions.
- **Pas de PII** dans les logs front par défaut.
- **Nettoyage du contenu riche** (par ex. via DOMPurify) pour les champs texte riches.

> La responsabilité de la sécurité métier et de la conformité réglementaire (KYC/AML, etc.) reste côté backend ; l’objectif de cette suite est d’appliquer systématiquement les bonnes pratiques front.

---

## ♿ Accessibilité

- **Conformité WCAG 2.1 AA** visée sur les composants clés.
- Navigation clavier complète (focus visible, ordre logique).
- Gestion explicite du focus sur les changements de vue critiques.
- Utilisation appropriée des attributs ARIA.
- Contrastes vérifiés pour les thèmes par défaut.

---

## ⚡ Performance

- **Code splitting par module** pour ne charger que ce qui est nécessaire.
- **Virtualisation des listes** pour les écrans avec > 1000 lignes.
- **Cache** (par ex. via React Query ou équivalent) pour les appels d’API fréquents.
- **Lazy loading** des composants lourds (charts, vues complexes).

L’objectif est de garder des back-offices « lourds en données » très réactifs, même sur des machines standard en entreprise.

---

## 🚀 Déploiement

### Build & packaging

```bash
# Build production global
pnpm build

# Package UI pour un registre npm (public ou privé)
cd packages/ui
npm publish

# Build de la starter app pour un déploiement statique
cd ../../apps/starter
pnpm build
# Servir le dossier dist/ derrière votre reverse-proxy / gateway
```

### Intégration client typique

1. Installer le package UI : `npm install @bank/ui` (ou via votre registry privé).
2. Cloner/copier `apps/starter` comme base de projet client.
3. Configurer `public/client.config.json` (branding, modules, endpoints d’API).
4. Implémenter/surcharger les adaptateurs d’API par module.
5. Personnaliser le thème (CSS custom properties, tokens de design, etc.).

---

## 🧪 Tests

Selon la configuration du repo :

- **Unitaires / intégration** : via Vitest/Jest (scripts `pnpm test`).
- **E2E** : via Playwright (`pnpm test:e2e`).
- **Linting & formatage** : ESLint + Prettier (scripts à adapter au besoin).

Objectifs recommandés :

- Couverture élevée sur les composants UI critiques (formulaires, workflows d’approbation).
- Tests de régression sur les modules sensibles (transactions, users & roles).

---

## 📌 Roadmap (exemple)

- [x] Modules de base : Dashboard, Transactions, Users & Roles.
- [x] Audit module optionnel.
- [x] Packaging du UI en `@bank/ui`.
- [ ] Mode sombre global.
- [ ] Catalogues de thèmes par client.
- [ ] Lib de graphiques bancaires préconfigurés (performance, risques, etc.).
- [ ] Générateurs de modules « template » pour accélérer les nouvelles features.

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Voir le fichier `LICENSE` (ou la section licence de votre mono-repo) pour plus de détails.
