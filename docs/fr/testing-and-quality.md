## Tests & Qualité

### Vue d’ensemble

Le dépôt est livré avec un setup de tests et de linting conçu pour :

- un feedback rapide sur les changements front,  
- une couverture smoke des parcours critiques,  
- un style de code cohérent entre modules.

### Outils

- **Vitest + Testing Library** – tests unitaires et components (`pnpm test`).  
- **Playwright** – tests E2E smoke (`pnpm test:e2e`).  
- **ESLint + Prettier** – linting et formatage (`pnpm lint`, `pnpm format`).

### Vitest & tests de composants

Utiliser Vitest pour couvrir :

- le routing et le bootstrap (`App.jsx`),  
- la logique d’activation des modules (`moduleRegistry`),  
- les écrans et flux UI critiques de chaque module.

Commande typique :

```bash
pnpm test
```

Vous pouvez également lancer les tests en mode watch pour le dev local.

### Playwright & tests E2E

Playwright est configuré pour des tests **smoke** :

- parcours de login,  
- navigation vers le Dashboard,  
- interactions de base avec les modules clés.

Commande :

```bash
pnpm test:e2e
```

Étendre les tests E2E pour couvrir :

- les contrôles de permissions (utilisateurs avec/sans rôles),  
- les happy paths sur Transactions et Audit,  
- les régressions sur les parcours critiques avant release.

### Linting & formatage

ESLint et Prettier permettent de garder un code homogène :

- forcer des patterns React/JS modernes,  
- éviter les erreurs courantes (variables non utilisées, patterns risqués),  
- standardiser le formatage pour des diffs lisibles.

Intégrer le lint dans la CI pour que les pull requests doivent passer avant merge.

### Ajouter des tests pour un nouveau module

Lorsque vous ajoutez un module (ex. `limits`) :

1. **Tests unitaires/components**  
   - tester son contrat `module.js` (id/basePath/sidebarItems),  
   - tester les vues principales (render, interactions de base).
2. **Tests d’intégration**  
   - vérifier l’activation/désactivation via `client.config.json`.  
3. **E2E (optionnel mais recommandé)**  
   - ajouter un parcours minimal : login → navigation vers le module → action clé.

### Checklist de revue de code pour modules

- [ ] Le module exporte un contrat valide (`id`, `name`, `basePath`, `routes`, `sidebarItems`).  
- [ ] Les routes utilisent le lazy loading si le module est lourd.  
- [ ] Les appels d’API passent par un adaptateur, pas par `fetch` ou un client brut.  
- [ ] Des tests de base (Vitest) existent et passent.  
- [ ] Optionnel : smoke E2E pour les modules métier critiques.  
- [ ] L’UI réutilise les composants `@bank/ui` lorsque pertinent.  
- [ ] Pas d’URLs spécifiques environnement en dur (utiliser `client.config.json` / config).


