/**
 * Élément de navigation latérale dérivé d'un module métier.
 *
 * @typedef {Object} BankModuleSidebarItem
 * @property {string} label - Libellé affiché dans la sidebar.
 * @property {string} to - Chemin de navigation (souvent égal à basePath).
 * @property {string} [icon] - Optionnel : identifiant d’icône pour l’UI.
 * @property {number} [order] - Optionnel : ordre d’affichage relatif entre modules/items.
 */

/**
 * Contrat commun à tous les modules métier du backoffice.
 *
 * Un module est une "feature" isolée : il déclare un préfixe de route,
 * un ensemble de sous-routes, et ce qu'il expose à la navigation globale.
 *
 * @typedef {Object} BankModule
 * @property {string} id - Identifiant unique du module (clé utilisée dans client.config.json).
 * @property {string} name - Libellé affiché dans la navigation et l’UI.
 * @property {string} basePath - Préfixe de route (ex: "/transactions").
 * @property {() => JSX.Element} routes - Composant React qui déclare les <Routes> internes du module.
 * @property {BankModuleSidebarItem[]} sidebarItems - Éléments de navigation latérale dérivés de ce module.
 * @property {string[]} [permissionsRequired] - Permissions/roles nécessaires pour accéder au module.
 * @property {Record<string, boolean>} [featureFlags] - Flags pour activer/désactiver des sous-fonctionnalités.
 * @property {Object} [apiAdapter] - Adaptateurs d’API spécifiques au module (list, get, update, etc.).
 */

