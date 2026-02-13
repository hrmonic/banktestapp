## Contrat BankModule (référence technique)

Ce document décrit le **contrat canonique** des modules métier utilisés dans l’app starter
`apps/starter/src/modules/`.

Il est la référence alignée avec `apps/starter/src/core/types.ts` (réexporté par `modules/types.ts`).

---

## Éléments de sidebar

```js
/**
 * @typedef {Object} BankModuleSidebarItem
 * @property {string} label
 * @property {string} to
 * @property {string} [icon]
 * @property {number} [order]
 */
```

- `label` : texte affiché dans la sidebar.
- `to` : chemin de navigation (souvent égal à `basePath`).
- `icon` (optionnel) : identifiant d’icône.
- `order` (optionnel) : ordre relatif d’affichage.

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
  Identifiant unique du module, utilisé dans `client.config.json` (`modules.{id}`).

- `name`  
  Libellé lisible affiché dans l’UI (sidebar, titres, etc.).

- `basePath`  
  Préfixe de route du module, par ex. `"/transactions"` ou `"/audit"`.  
  Toutes les routes internes du module sont imbriquées sous ce chemin.

- `routes`  
  Composant React qui déclare les **routes internes** du module via `<Routes>` / `<Route>`.

- `sidebarItems`  
  Liste des entrées que le module ajoute à la navigation latérale.

- `permissionsRequired` (optionnel)  
  Permissions / rôles nécessaires pour accéder au module (utilisés par la couche RBAC) :
  - pour filtrer les entrées de sidebar via `getSidebarItems(config, userPermissions)`,
  - pour bloquer l’accès direct aux routes via `ModuleRouteGuard`.

- `featureFlags` (optionnel)  
  Flags simples pour activer/désactiver des sous-fonctionnalités.

- `apiAdapter` (optionnel)  
  Objet regroupant les **adaptateurs d’API** du module (ex : `list`, `get`, `approve`, etc.).

---

## Checklist auteur de module

Pour chaque nouveau module ou refactor :

- le fichier racine exporte `default` en tant que `BankModule`,
- `id` est stable et cohérent avec `client.config.json`,
- `basePath` commence par `/` et n’entre pas en conflit avec d’autres modules,
- `routes` contient toutes les vues internes du module,
- `sidebarItems` est correctement renseigné pour la navigation,
- les propriétés optionnelles (`permissionsRequired`, `featureFlags`, `apiAdapter`) sont utilisées de façon cohérente.
- pour les modules sensibles (`users-roles`, `audit`, etc.), `permissionsRequired` doit refléter explicitement les rôles autorisés.
