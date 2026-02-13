## Module – Dashboard

### What it is

The **Dashboard** module provides an overview of key banking KPIs for internal users:

- global metrics (balances, volumes, incidents),
- configurable widgets per role,
- time and segment filters (products, regions, customer segments, etc. depending on your APIs).

Typical use cases:

- daily monitoring of payment volumes and trends,
- quick detection of incidents and abnormal behaviors,
- management reporting for head‑office teams.

### How it works technically

Location:

- `apps/starter/src/modules/dashboard/` (or an equivalent folder, depending on your setup).

The module exports a **BankModule contract**:

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

Internally, it defines `DashboardRoutes` with nested `<Routes>` for its pages.  
Views typically consume:

- metrics and chart data from your APIs (via an adapter),
- shared layout and components from `@bank/ui` (`PageLayout`, `Card`, `Button`, etc.).

### Integration examples

#### Enabling the module in `client.config.json`

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": false }
  }
}
```

If `"dashboard": { "enabled": false }`, the module will not appear in navigation and its routes will not be registered.

#### Wiring a custom API adapter

```js
// default adapter
const dashboardAdapter = {
  getKpis: (params) => apiClient.get('/dashboard/kpis', { params }),
};

// client‑specific override
const customDashboardAdapter = {
  ...dashboardAdapter,
  getKpis: (params) =>
    apiClient.get('/custom/metrics', {
      params: mapFiltersToCustomFormat(params),
    }),
};
```

Your views import and use `customDashboardAdapter` instead of the default one when you integrate with a specific backend.

### Customization & extensibility

You can customize:

- **widgets**: add/remove cards, KPIs and charts,
- **filters**: adapt filters to your data model (branches, regions, segments),
- **permissions**: show or hide specific widgets depending on user roles,
- **layout**: reuse or override layout components from `@bank/ui`.
