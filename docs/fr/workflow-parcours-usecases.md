# Parcours utilisateur et use cases par rôle

Ce document formalise les **parcours** et **use cases** par profil métier pour l’app starter. Il sert à l’onboarding, aux tests E2E et à l’alignement produit.

---

## 1. Profils et modules accessibles

| Profil (démo)    | ID technique       | Modules accessibles (sidebar)                                                 | Use case principal                                     |
| ---------------- | ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| Agent d’agence   | `agent-agence`     | Dashboard, Comptes                                                            | Consulter les comptes clients, voir l’activité récente |
| Manager d’agence | `manager-agence`   | Dashboard, Comptes, Transactions, Rapports                                    | Piloter l’agence, volumes, rapports                    |
| Analyste audit   | `analyste-audit`   | Dashboard, Transactions, Audit, Rapports                                      | Journal d’audit, conformité, anomalies                 |
| Admin backoffice | `admin-backoffice` | Dashboard, Comptes, Transactions, Approbations, Users & Roles, Reports, Audit | Gestion utilisateurs, audit, comptes                   |
| Super Admin      | `super-admin`      | Tous les modules                                                              | Accès complet (démo)                                   |

**Source de vérité** : `apps/starter/src/core/constants.ts` (PROFILE_IDS, PERMISSIONS), `apps/starter/src/lib/security/profilePermissions.ts`, et chaque module dans `apps/starter/src/modules/*/module.tsx` (permissionsRequired, basePath).

---

## 2. Écrans principaux par module

| Module        | Route (basePath) | Écrans principaux                                 | Actions typiques (démo)                         |
| ------------- | ---------------- | ------------------------------------------------- | ----------------------------------------------- |
| Dashboard     | `/dashboard`     | Tableau de bord (KPIs, alertes, activité récente) | Voir les indicateurs, liens vers autres modules |
| Comptes       | `/accounts`      | Liste des comptes, détail d’un compte             | Consulter liste, ouvrir un compte               |
| Transactions  | `/transactions`  | Historique des transactions                       | Filtrer, consulter                              |
| Approbations  | `/approvals`     | File d’approbation                                | (démo)                                          |
| Users & Roles | `/users-roles`   | Gestion des utilisateurs et rôles                 | (réservé admin)                                 |
| Rapports      | `/reports`       | Rapports et exports                               | Consulter rapports                              |
| Audit         | `/audit`         | Journal d’audit                                   | Consulter les événements                        |

---

## 3. Flux global

1. **Chargement** : `client.config.json` → validation Zod → liste des modules activés.
2. **Non authentifié** : redirection vers `/login`.
3. **Login** : choix du profil (démo), email, mot de passe → session en mémoire + redirection vers le premier module autorisé (ou `/no-modules` si aucun module activé).
4. **Authentifié** : AppShell (sidebar + contenu). Sidebar = modules activés ET accessibles selon les permissions du profil.
5. **Accès à une URL non autorisée** : redirection vers `/unauthorized` (avec liens « Retour au tableau de bord » et « Se déconnecter »).
6. **Déconnexion** : bouton « Déconnexion » dans la sidebar → retour à `/login`. Pour changer de profil en démo : se déconnecter puis choisir un autre profil sur la page de connexion.

---

## 4. Checklist E2E – Workflow

À couvrir dans les tests E2E (Playwright) :

- [ ] **Config** : chargement avec config valide ; config invalide affiche une page d’erreur dédiée.
- [ ] **Login** : avec chaque profil (agent, manager, analyste, admin, super-admin), vérifier la redirection et les modules visibles dans la sidebar.
- [ ] **Navigation** : accès à chaque module autorisé pour un profil donné ; liens de la sidebar fonctionnels.
- [ ] **RBAC** : utilisateur sans droit (ex. agent) qui accède à une URL protégée (ex. `/users-roles`) → page « Accès refusé » ou redirection.
- [ ] **Unauthorized** : sur `/unauthorized`, les liens « Retour à l'accueil » et « Se déconnecter » sont présents et fonctionnels.
- [ ] **Déconnexion** : clic sur « Déconnexion » dans la sidebar → redirection vers `/login`, session effacée.
- [ ] **Aucun module activé** : config avec tous les modules désactivés, utilisateur authentifié → redirection vers `/no-modules`, page « Aucun module activé » avec bouton « Se déconnecter ».

---

## 5. Références

- Architecture : `docs/fr/architecture.md`
- Sécurité et RBAC : `docs/fr/security-compliance.md`
- Tests : `docs/fr/testing-and-quality.md`, `apps/starter/tests/e2e/`
