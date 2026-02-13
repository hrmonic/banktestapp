## API adapters per module

### Purpose

API adapters isolate each module from backend‑specific details:

- modules call adapters, not raw HTTP clients,
- per‑client overrides are easy and localized,
- contracts stay stable while implementations change.

### Default adapter pattern

Each module exposes a default adapter, for example for Transactions:

```js
const transactionsAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};
```

Views only depend on this adapter:

```js
const { data, isLoading } = useQuery({
  queryKey: ['transactions', filters],
  queryFn: () => transactionsAdapter.list(filters),
});
```

### Overriding adapters per client

To integrate with a specific backend, you usually:

1. create a custom adapter,
2. wire it in the module instead of the default one.

Example:

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

### Examples by module

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

You can plug these onto your SIEM or audit store.

### Best practices

- Keep adapter interfaces **stable** across clients.
- Do not leak backend‑specific details (field names, error shapes) into views.
- Centralize error handling, retries and logging inside adapters or `apiClient`.
- Cover adapters with tests when workflows are critical (see `testing-and-quality.md`).
