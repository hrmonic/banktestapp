## BankModule contract (technical reference)

This document describes the **canonical contract** for feature modules used in the starter app
under `apps/starter/src/modules/`.

It is the technical source of truth that mirrors `apps/starter/src/core/types.ts` (re-exported by `modules/types.ts`).

---

## Sidebar items

```js
/**
 * @typedef {Object} BankModuleSidebarItem
 * @property {string} label
 * @property {string} to
 * @property {string} [icon]
 * @property {number} [order]
 */
```

- `label`: text displayed in the sidebar.
- `to`: route path used for navigation (usually equal to `basePath`).
- `icon` (optional): identifier for an icon component (implementation-specific).
- `order` (optional): relative ordering when building the sidebar.

---

## BankModule

```js
/**
 * @typedef {Object} BankModule
 * @property {string} id
 * @property {string} name
 * @property {string} basePath
 * @property {() => JSX.Element} routes
 * @property {BankModuleSidebarItem[]} sidebarItems
 * @property {string[]} [permissionsRequired]
 * @property {Record<string, boolean>} [featureFlags]
 * @property {Object} [apiAdapter]
 */
```

- `id`  
  Unique identifier for the module.  
  Must match the key used in `client.config.json` under `modules.{id}`.

- `name`  
  Human‑readable label used in the UI (sidebar, page titles, etc.).

- `basePath`  
  Route prefix for the module, for example `"/transactions"` or `"/audit"`.  
  All internal routes of the module are nested under this base path.

- `routes`  
  React component that declares the **internal routing** for the module using `<Routes>` / `<Route>`.
  Example:

  ```js
  function TransactionsRoutes() {
    return (
      <Routes>
        <Route index element={<TransactionsHome />} />
        <Route path=":id" element={<TransactionDetails />} />
      </Routes>
    );
  }
  ```

- `sidebarItems`  
  List of items contributed to the global sidebar.
  Each item can override `to` and `order` if needed.

- `permissionsRequired` (optional)  
  List of roles/permissions required to access the module.
  These are consumed by **RBAC guards** to:
  - hide modules from the sidebar via `getSidebarItems(config, userPermissions)`,
  - block direct access to module routes via `ModuleRouteGuard`.

- `featureFlags` (optional)  
  Simple on/off flags for optional sub‑features inside the module.

- `apiAdapter` (optional)  
  Object bundling **API adapter functions** used by the module.  
  Example:

  ```js
  const transactionsAdapter = {
    list: (params) => apiClient.get('/transactions', { params }),
    get: (id) => apiClient.get(`/transactions/${id}`),
    approve: (id) => apiClient.post(`/transactions/${id}/approve`),
  };
  ```

---

## Checklist for module authors

When you create or update a module:

- the module’s root file exports `default` as a `BankModule`,
- `id` is stable and matches `client.config.json`,
- `basePath` starts with `/` and does not overlap with other modules,
- `routes` contains all internal views for the module,
- `sidebarItems` is non‑empty for modules that should appear in the navigation,
- optional `permissionsRequired`, `featureFlags` and `apiAdapter` are used consistently where needed.
- when a module is considered \"sensitive\" (e.g. `users-roles`, `audit`), `permissionsRequired`
  should explicitly reflect the roles allowed to access it.
