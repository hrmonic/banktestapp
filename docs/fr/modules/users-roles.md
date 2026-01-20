## Module – Users & Roles

### Ce que c’est

Le module **Users & Roles** fournit une interface de gestion des rôles et permissions :

- définition de rôles et attribution aux utilisateurs,  
- permissions fines par module et par action,  
- intégration possible avec un IAM / IDP existant (OIDC, SAML, etc.).

Cas d’usage typiques :

- donner un accès en lecture seule au module Transactions à certains profils,  
- restreindre les actions d’approbation aux managers,  
- aligner les permissions UI sur les rôles du core banking.

### Comment ça marche techniquement

Localisation :

- `apps/starter/src/modules/users-roles/` (ou équivalent).

Le module exporte un **contrat BankModule** :

```js
/** @type {import("../types.d.js").BankModule} */
const usersRolesModule = {
  id: "users-roles",
  name: "Users & Roles",
  basePath: "/users-roles",
  routes: UsersRolesRoutes,
  sidebarItems: [{ label: "Users & Roles", to: "/users-roles" }],
};

export default usersRolesModule;
```

En interne, le module interagit généralement avec :

- un provider d’identité / annuaire (liste d’utilisateurs, rôles),  
- un modèle de permissions utilisé par les guards de routes et de composants.

### Intégration avec le RBAC

Au niveau applicatif, des guards vérifient que l’utilisateur possède les rôles/permissions requis avant :

- de monter certaines routes,  
- d’afficher des composants ou actions sensibles.

Le module Users & Roles fournit l’UI pour :

- visualiser et éditer l’attribution des rôles,  
- raccorder les rôles aux permissions utilisées dans les guards.

### Exemples d’intégration

#### Activer le module

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": true }
  }
}
```

#### Mapping avec un IAM externe

Vous pouvez garder la source de vérité dans votre IAM et exposer une UI read‑only, ou permettre des modifications qui appellent vos APIs IAM :

```js
const usersRolesAdapter = {
  listUsers: () => iamClient.get("/users"),
  listRoles: () => iamClient.get("/roles"),
  assignRole: (userId, roleId) =>
    iamClient.post(`/users/${userId}/roles`, { roleId }),
};
```

### Personnalisation & extensibilité

Personnalisations possibles :

- modéliser rôles et permissions à l’identique de vos systèmes cœur,  
- masquer ce module en production si la gestion des rôles est externalisée,  
- exposer des vues supplémentaires (matrice de permissions par module, audit des changements de rôles).


