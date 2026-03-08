# Changelog

Tous les changements notables du projet sont consignés ici.

## [Non publié]

- README : badge CI, lien Live demo, section « Pour les recruteurs », aperçu produit.
- CI : workflow GitHub Actions (lint, build, tests unitaires, tests sécurité).
- Doc : déploiement démo (Vercel/Netlify) dans `docs/deploy-demo.md`, dossier `docs/screenshots/` pour les captures.

## [0.1.0] – à définir

- Suite front-end modulaire (Dashboard, Transactions, Accounts, Approvals, Users & Roles, Reports, Audit).
- Monorepo : `apps/starter` + `packages/ui` (@bank/ui).
- Config client validée (Zod), RBAC, session timeout, thèmes.
- Sécurité : apiClient durci, sanitization, tests adversariaux, E2E sécurité.
- Documentation : architecture, sécurité, contrats API, accessibilité (`docs/`, `docs/en/`, `docs/fr/`).

[Non publié]: https://github.com/hrmonic/banktestapp/compare/main...HEAD
[0.1.0]: https://github.com/hrmonic/banktestapp/releases/tag/v0.1.0
