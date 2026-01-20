/**
 * Contrat commun à tous les modules métier du backoffice.
 *
 * @typedef {Object} BankModule
 * @property {string} id - Identifiant unique du module (clé utilisée dans client.config.json).
 * @property {string} name - Libellé affiché dans la navigation et l’UI.
 * @property {string} basePath - Préfixe de route (ex: \"/transactions\").
 * @property {() => JSX.Element} routes - Composant React qui déclare les <Routes> internes du module.
 * @property {{ label: string, to: string }[]} sidebarItems - Éléments de navigation latérale dérivés de ce module.
 */


