## Adaptateurs d’API par module

### Rôle

Les adaptateurs d’API isolent chaque module des détails spécifiques au backend :

- les modules appellent les adaptateurs, pas directement le client HTTP,
- les surcharges par client sont simples et localisées,
- les contrats restent stables alors que les implémentations peuvent varier.

### Pattern d’adaptateur par défaut

Chaque module expose un adaptateur par défaut, par exemple pour Transactions :

```js
const transactionsAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};
```

Les vues ne dépendent que de cet adaptateur :

```js
const { data, isLoading } = useQuery({
  queryKey: ['transactions', filters],
  queryFn: () => transactionsAdapter.list(filters),
});
```

### Surcharger les adaptateurs par client

Pour intégrer un backend spécifique, vous :

1. créez un adaptateur custom,
2. le câblez dans le module à la place du défaut.

Exemple :

```js
import { apiClient } from '../lib/apiClient';
import { mapParamsToCustomFormat } from './mapping';

const defaultAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};

export const customTransactionsAdapter = {
  ...defaultAdapter,
  list: (params) =>
    apiClient.get('/custom/txns', {
      params: mapParamsToCustomFormat(params),
    }),
};
```

### Exemples par module

#### Dashboard

```js
export const dashboardAdapter = {
  getKpis: (params) => apiClient.get('/dashboard/kpis', { params }),
};
```

#### Users & Roles

```js
export const usersRolesAdapter = {
  listUsers: () => iamClient.get('/users'),
  listRoles: () => iamClient.get('/roles'),
  assignRole: (userId, roleId) =>
    iamClient.post(`/users/${userId}/roles`, { roleId }),
};
```

#### Audit

```js
export const auditAdapter = {
  list: (params) => apiClient.get('/audit/logs', { params }),
  get: (id) => apiClient.get(`/audit/logs/${id}`),
};
```

À vous de les raccorder à votre SIEM ou à votre base d’audit.

### Bonnes pratiques

- Garder les interfaces des adaptateurs **stables** entre clients.
- Ne pas exposer de détails backend‑spécifiques (noms de champs, formats d’erreurs) dans les vues.
- Centraliser la gestion des erreurs, retries et logs dans les adaptateurs ou `apiClient`.
- Couvrir les adaptateurs par des tests lorsque les workflows sont critiques (voir `testing-and-quality.md`).
