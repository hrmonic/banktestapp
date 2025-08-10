# Backoffice Bancaire - Produit Front-end Modulaire

## Vue d'ensemble

Produit front-end packagé pour backoffice bancaire, **UI/UX uniquement** (aucun backend). Interface modulaire, brandable et accessible (WCAG 2.1 AA).

### Architecture

- **UI Package** (`packages/ui/`) : Librairie de composants réutilisables
- **Starter App** (`apps/starter/`) : Application de démonstration et d'intégration
- **Adaptateurs d'API** : Chaque module récupère ses données via API externes configurables
- **RBAC** : Gestion des permissions par rôles
- **Branding** : Thématisation configurable par client

## Installation

```bash
pnpm install
pnpm build
```

## Développement

```bash
# Démarrer l'app de démo
pnpm dev

# Tests
pnpm test              # Tests unitaires/intégration
pnpm test:e2e          # Tests end-to-end

# Build
pnpm build             # Build tous les packages
pnpm -F @bank/ui build # Build UI package uniquement
```

## Configuration Client

### 1. Configuration des modules (`client.config.json`)

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
    "users-roles": { "enabled": false }
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

### 2. Adaptateurs d'API

Chaque module expose un adaptateur configurable :

```javascript
// Adaptateur par défaut (conventions REST)
const transactionsAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};

// Surcharge pour API spécifique client
const customAdapter = {
  ...transactionsAdapter,
  list: (params) => apiClient.get('/custom/txns', { 
    params: mapParamsToCustomFormat(params) 
  }),
};
```

## Modules Disponibles

### Dashboard
- Vue d'ensemble KPIs bancaires
- Widgets configurables par rôle

### Transactions
- Liste paginée avec filtres avancés
- Approbation en lot
- Export CSV/XLSX

### Utilisateurs & Rôles
- Gestion RBAC
- Attribution de permissions

### Audit (optionnel)
- Logs d'activité
- Traçabilité des actions

## Sécurité

- **Tokens en mémoire** uniquement
- **CSP** configuré
- **RBAC** avec guards sur routes/composants
- **Pas de PII** dans les logs
- **DOMPurify** pour rich text

## Accessibilité

- **WCAG 2.1 AA** conforme
- Navigation clavier complète
- Focus management
- ARIA labels appropriés
- Contrastes validés

## Performance

- **Code-splitting** par module
- **Virtualisation** des listes > 1000 lignes
- **Cache** React Query intelligent
- **Lazy loading** des composants

## Déploiement

```bash
# Build production
pnpm build

# Package UI pour npm
cd packages/ui && npm publish

# Deploy starter app
cd apps/starter && pnpm build
# Servir le dossier dist/
```

## Intégration Client

1. Installer le package UI : `npm install @bank/ui`
2. Copier la starter app
3. Configurer `client.config.json`
4. Implémenter les adaptateurs d'API spécifiques
5. Personnaliser le thème via CSS custom properties

## Support

- Node.js ≥ 18
- Navigateurs evergreen (Chrome, Firefox, Safari, Edge)
- React ≥ 18