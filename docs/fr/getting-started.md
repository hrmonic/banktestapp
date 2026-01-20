## Prise en main

### Prérequis

- **Node.js** ≥ 18  
- **pnpm** (recommandé ; npm/yarn possibles avec quelques ajustements de scripts)  
- Navigateurs evergreen (Chrome, Firefox, Safari, Edge)

Optionnel :

- Docker / registry pour le déploiement  
- Reverse proxy ou API gateway devant vos APIs backend

### Installation

```bash
# Installer les dépendances
pnpm install

# Lancer l’application de démo / starter
pnpm dev
```

Par défaut, l’application de démo vit dans `apps/starter` et expose les principaux modules (dashboard, transactions, users & roles, audit).

### Structure du projet (vue globale)

```text
banktestapp-main/
├── apps/
│   └── starter/            # Application de démonstration & base d’intégration
│       ├── src/
│       │   ├── pages/      # Login, 404, Unauthorized, etc.
│       │   ├── modules/    # Modules métier (transactions, dashboard, etc.)
│       │   ├── components/ # Layout, ErrorBoundary, Loading, etc.
│       │   └── lib/        # Auth, sécurité, config client
│       └── public/
│           └── client.config.json # Configuration client par environnement
│
├── packages/
│   └── ui/                 # Librairie de composants réutilisables (@bank/ui)
│       └── src/
│           └── index.js
│
├── vite.config.* / vitest.config.mjs / playwright.config.ts
└── package.json / pnpm-workspace.yaml
```

- `apps/starter` : ce que vous allez typiquement forker ou copier pour un projet client.  
- `packages/ui` : ce que vous pouvez publier en `@bank/ui` sur votre registry.

### Lancer en développement

```bash
# Démarrer l’app starter (apps/starter)
pnpm dev

# Tests unitaires / components
pnpm test

# Tests E2E (Playwright)
pnpm test:e2e
```

Vous pouvez ensuite ouvrir l’application dans votre navigateur, vous connecter via le provider d’authentification configuré, et explorer les modules comme Dashboard ou Transactions.

### Build pour la production

```bash
# Build production global (UI + apps)
pnpm build

# Build du package UI uniquement
pnpm -F @bank/ui build

# Build de l’app starter uniquement
cd apps/starter
pnpm build
```

Le build de l’app starter produit des assets statiques dans `apps/starter/dist/` que vous pouvez servir derrière votre reverse proxy ou API gateway.

### Première configuration (`client.config.json`)

Avant un déploiement réel, il est conseillé de :

1. Copier `apps/starter/public/client.config.json` et l’adapter par environnement (dev, préprod, prod).  
2. Ajuster :
   - `branding` : nom de la banque, logo, couleur principale ;  
   - `modules` : quels modules sont activés ;  
   - `api` : base URL et timeouts ;  
   - `auth` : paramètres OIDC ou provider d’authentification.

Voir `configuration/client-config.md` pour la référence complète.

### Checklist rapide IT / Ops

- [ ] Node.js ≥ 18 disponible en CI/CD  
- [ ] La pipeline de build exécute `pnpm install` puis `pnpm build`  
- [ ] Les fichiers statiques de `apps/starter/dist/` sont déployés derrière un reverse proxy  
- [ ] `client.config.json` est versionné ou templatisé par environnement  
- [ ] Les en‑têtes CSP et sécurité sont configurés selon vos politiques  
- [ ] Le monitoring / logging des erreurs front est connecté à votre stack d’observabilité

```mermaid
flowchart LR
  dev[Dev]
  repo[Repo_BankUI]
  build[Build_CI]
  dist[Assets_statiques]
  proxy[Reverse_Proxy]
  users[Utilisateurs]

  dev --> repo
  repo --> build
  build --> dist
  dist --> proxy
  users --> proxy
  proxy --> dist
```


