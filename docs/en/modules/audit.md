## Module – Audit

### What it is

The **Audit** module exposes user activity logs and traceability features:

- activity logs by user, resource, module and action,
- filters by date, user, resource type, status, etc.,
- views to help investigations and internal control.

Typical use cases:

- reconstructing actions performed on a customer account,
- supporting internal/external audits and compliance checks,
- monitoring access to sensitive features (approvals, limits, overrides).

### How it works technically

Location:

- `apps/starter/src/modules/audit/`.

The module exports a **BankModule contract**:

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

Internally, `AuditRoutes` defines the main log listing and optional detail views.

### API adapter

Example of generic audit adapter:

```js
const auditAdapter = {
  list: (params) => apiClient.get('/audit/logs', { params }),
  get: (id) => apiClient.get(`/audit/logs/${id}`),
};
```

You can override this to match your log storage (SIEM, audit DB, log service, etc.).

### Integration examples

#### Enabling the module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "audit": { "enabled": true }
  }
}
```

#### Example SIEM integration

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

### Customization & extensibility

You can:

- add columns and views specific to your audit model,
- link audit entries to core back‑office screens (customer, account, transaction),
- add export functions or integration with your evidence archiving process.
