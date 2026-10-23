## Module – Transactions

### What it is

The **Transactions** module focuses on listing and managing payment transactions:

- paginated list with advanced filters (date, amount, status, channel, etc.),
- single and bulk approval flows,
- export capabilities (CSV/XLSX via your backend or front utilities).

Typical use cases:

- manual validation of high‑value payments,
- second‑level control for sensitive destinations,
- investigation of disputed or suspicious transactions.

### How it works technically

Location:

- `apps/starter/src/modules/transactions/`.

The module exports a **BankModule contract**:

```js
/** @type {import("../types").BankModule} */
const transactionsModule = {
  id: 'transactions',
  name: 'Transactions',
  basePath: '/transactions',
  routes: TransactionsRoutes,
  sidebarItems: [{ label: 'Transactions', to: '/transactions' }],
};

export default transactionsModule;
```

Internally, `TransactionsRoutes` defines:

- an index route for the listing page,
- optional sub‑routes (details, approvals, etc.).

### API adapters

Each module uses an **API adapter** that you can override per client.  
For transactions, a typical default adapter looks like:

```js
const transactionsAdapter = {
  list: (params) => apiClient.get('/transactions', { params }),
  get: (id) => apiClient.get(`/transactions/${id}`),
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
};
```

You can override it to match your backend conventions:

```js
const customTransactionsAdapter = {
  ...transactionsAdapter,
  list: (params) =>
    apiClient.get('/custom/txns', {
      params: mapParamsToCustomFormat(params),
    }),
};
```

Your views import this adapter and never talk directly to `apiClient`, which keeps integration changes localized.

### Integration examples

#### Enabling the module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "audit": { "enabled": false }
  }
}
```

#### Example filter mapping

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

### Customization & extensibility

You can:

- tune filters (add fields, change default ranges),
- extend actions (reject, reassign, comment, attach documents),
- integrate workflow engines (multi‑step approvals),
- adapt columns and row rendering to match your internal standards.
