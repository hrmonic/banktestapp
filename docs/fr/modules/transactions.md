## Module – Transactions

### Ce que c’est

Le module **Transactions** est dédié à la liste et à la gestion des opérations de paiement :

- liste paginée avec filtres avancés (date, montant, statut, canal, etc.),  
- workflows d’actions (approbation unitaire ou en lot),  
- capacités d’export (CSV/XLSX via vos APIs ou utilitaires front).

Cas d’usage typiques :

- validation manuelle de paiements à haut montant,  
- contrôle de second niveau pour des destinations sensibles,  
- investigation d’opérations litigieuses ou suspectes.

### Comment ça marche techniquement

Localisation :

- `apps/starter/src/modules/transactions/`.

Le module exporte un **contrat BankModule** :

```js
/** @type {import("../types.d.js").BankModule} */
const transactionsModule = {
  id: "transactions",
  name: "Transactions",
  basePath: "/transactions",
  routes: TransactionsRoutes,
  sidebarItems: [{ label: "Transactions", to: "/transactions" }],
};

export default transactionsModule;
```

`TransactionsRoutes` définit :

- une route index pour la liste,  
- éventuellement des sous‑routes (détail, approbation, etc.).

### Adaptateurs d’API

Chaque module s’appuie sur un **adaptateur d’API** surchargable par client.  
Pour Transactions, un adaptateur par défaut typique :

```js
const transactionsAdapter = {
  list: (params) => apiClient.get("/transactions", { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};
```

Vous pouvez le surcharger pour coller aux conventions de votre backend :

```js
const customTransactionsAdapter = {
  ...transactionsAdapter,
  list: (params) =>
    apiClient.get("/custom/txns", {
      params: mapParamsToCustomFormat(params),
    }),
};
```

Les vues parlent à l’adaptateur, jamais directement à `apiClient`, ce qui localise les changements d’intégration.

### Exemples d’intégration

#### Activer le module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "audit": { "enabled": false }
  }
}
```

#### Exemple de mapping de filtres

```js
function mapParamsToCustomFormat(params) {
  return {
    from_date: params.dateFrom,
    to_date: params.dateTo,
    min_amount: params.minAmount,
    status_list: params.statuses,
  };
}
```

### Personnalisation & extensibilité

Vous pouvez :

- ajuster les filtres (champs supplémentaires, valeurs par défaut),  
- étendre les actions (reject, reassign, commentaire, pièces jointes),  
- intégrer un moteur de workflow (approbations multi‑niveaux),  
- adapter colonnes et rendu de lignes à vos standards internes.


