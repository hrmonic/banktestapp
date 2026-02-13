## Module – Audit

### Ce que c’est

Le module **Audit** expose les logs d’activité utilisateur et les fonctions de traçabilité :

- journaux d’actions par utilisateur, ressource, module et action,
- filtres par date, utilisateur, type de ressource, statut, etc.,
- vues adaptées aux investigations et aux contrôles internes.

Cas d’usage typiques :

- reconstituer les actions réalisées sur un compte client,
- préparer des audits internes/externes et contrôles de conformité,
- suivre l’accès aux fonctionnalités sensibles (approbations, dépassements de limites, overrides).

### Comment ça marche techniquement

Localisation :

- `apps/starter/src/modules/audit/`.

Le module exporte un **contrat BankModule** :

```js
/** @type {import("../types").BankModule} */
const auditModule = {
  id: 'audit',
  name: 'Audit',
  basePath: '/audit',
  routes: AuditRoutes,
  sidebarItems: [{ label: 'Audit', to: '/audit' }],
};

export default auditModule;
```

`AuditRoutes` définit la vue principale de liste et, le cas échéant, des écrans de détail.

### Adaptateur d’API

Exemple d’adaptateur générique :

```js
const auditAdapter = {
  list: (params) => apiClient.get('/audit/logs', { params }),
  get: (id) => apiClient.get(`/audit/logs/${id}`),
};
```

Vous pouvez le surcharger pour refléter votre stockage de logs (SIEM, base d’audit, service de logs, etc.).

### Exemples d’intégration

#### Activer le module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "audit": { "enabled": true }
  }
}
```

#### Exemple d’intégration SIEM

```js
const siemAuditAdapter = {
  list: (params) =>
    siemClient.search({
      index: 'bank-audit',
      query: buildSiemQuery(params),
    }),
  get: (id) => siemClient.get({ index: 'bank-audit', id }),
};
```

### Personnalisation & extensibilité

Vous pouvez :

- ajouter des colonnes et vues spécifiques à votre modèle d’audit,
- relier les entrées d’audit aux écrans back‑office clés (client, compte, transaction),
- ajouter des exports ou des intégrations avec vos processus d’archivage de preuves.
