## Module – Dashboard

### Ce que c’est

Le **Dashboard** fournit une vue d’ensemble des principaux KPIs bancaires pour les utilisateurs internes :

- indicateurs globaux (encours, volumes, incidents),
- widgets configurables par rôle,
- filtres temporels et par segment (produits, régions, segments clients, selon vos APIs).

Cas d’usage typiques :

- suivi quotidien des volumes de paiements et des tendances,
- détection rapide d’incidents ou de comportements anormaux,
- reporting management pour les équipes siège.

### Comment ça marche techniquement

Localisation :

- `apps/starter/src/modules/dashboard/` (ou dossier équivalent selon votre organisation).

Le module exporte un **contrat BankModule** :

```js
/** @type {import("../types").BankModule} */
const dashboardModule = {
  id: 'dashboard',
  name: 'Dashboard',
  basePath: '/dashboard',
  routes: DashboardRoutes,
  sidebarItems: [{ label: 'Dashboard', to: '/dashboard' }],
};

export default dashboardModule;
```

En interne, `DashboardRoutes` définit les `<Routes>` du module.  
Les vues consomment en général :

- des données de métriques / graphiques fournies par vos APIs (via un adaptateur),
- le layout et les composants partagés de `@bank/ui` (`PageLayout`, `Card`, `Button`, etc.).

### Exemples d’intégration

#### Activer le module dans `client.config.json`

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": false }
  }
}
```

Si `"dashboard": { "enabled": false }`, le module n’apparaît pas dans la navigation et ses routes ne sont pas montées.

#### Câbler un adaptateur d’API spécifique

```js
// adaptateur par défaut
const dashboardAdapter = {
  getKpis: (params) => apiClient.get('/dashboard/kpis', { params }),
};

// surcharge pour un backend client spécifique
const customDashboardAdapter = {
  ...dashboardAdapter,
  getKpis: (params) =>
    apiClient.get('/custom/metrics', {
      params: mapFiltersToCustomFormat(params),
    }),
};
```

Vos vues importent `customDashboardAdapter` au lieu de l’adaptateur par défaut lorsque vous intégrez un backend donné.

### Personnalisation & extensibilité

Vous pouvez personnaliser :

- **les widgets** : ajouter/retirer des cartes, KPIs et graphiques,
- **les filtres** : adapter les filtres à votre modèle de données (agences, régions, segments),
- **les permissions** : afficher ou non certains widgets selon les rôles,
- **le layout** : réutiliser ou surcharger les composants de layout de `@bank/ui`.
