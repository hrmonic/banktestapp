## Module – Users & Roles

### What it is

The **Users & Roles** module provides a front‑end for managing roles and permissions:

- role definitions and assignment to users,
- fine‑grained permissions per module and action,
- optional integration with existing IAM / IDP solutions (OIDC, SAML, etc.).

Typical use cases:

- granting read‑only access on Transactions to some profiles,
- restricting approval actions to managers,
- aligning UI permissions with core banking roles.

### How it works technically

Location:

- `apps/starter/src/modules/users-roles/` (or similar).

The module exports a **BankModule contract**:

```js
/** @type {import("../types").BankModule} */
const usersRolesModule = {
  id: 'users-roles',
  name: 'Users & Roles',
  basePath: '/users-roles',
  routes: UsersRolesRoutes,
  sidebarItems: [{ label: 'Users & Roles', to: '/users-roles' }],
};

export default usersRolesModule;
```

Internally, the module typically interacts with:

- an auth / identity provider (to list users, sync roles),
- a permission model used by route and component guards.

### Integration with RBAC

At application level, guards check whether the user has the required role/permission before:

- mounting routes,
- rendering sensitive components or actions.

The Users & Roles module provides UI to:

- view and edit role assignments,
- link roles to the permissions used in guards.

### Integration examples

#### Enabling the module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": true }
  }
}
```

#### Mapping with an external IAM

You can keep the source of truth in your IAM and only expose a read‑only UI, or allow edits that call your IAM APIs:

```js
const usersRolesAdapter = {
  listUsers: () => iamClient.get('/users'),
  listRoles: () => iamClient.get('/roles'),
  assignRole: (userId, roleId) =>
    iamClient.post(`/users/${userId}/roles`, { roleId }),
};
```

### Customization & extensibility

Possible customizations:

- model roles and permissions exactly as in your core systems,
- hide this module in production if role management is done elsewhere,
- expose additional views (per‑module permission matrix, audit of role changes).
