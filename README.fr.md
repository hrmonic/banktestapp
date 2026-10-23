![Bannière Modular BankUI Studio](docs/assets/project-hero.svg)

# Modular BankUI Studio

**Une interface React et TypeScript modulaire pour les back-offices bancaires.**

[English](README.md) · [Fonctionnalités](#fonctionnalités) ·
[Installation](#installation) · [Architecture](#architecture) ·
[Sécurité](#sécurité-et-limites) · [FAQ](#questions-fréquentes)

[![Licence personnalisée](https://img.shields.io/badge/licence-conditions%20spécifiques-64748b)](LICENSE)
![Technologies](https://img.shields.io/badge/stack-React%20%2F%20TypeScript-475569)

> **Frontend uniquement.** Ce projet illustre des interfaces modulaires
> de back-office. Il ne comprend ni backend bancaire complet ni certification.
> Une utilisation en production exige des API sécurisées et une validation
> indépendante de la conformité et de la sécurité.

## Présentation

Modular BankUI Studio est une interface configurable pour les applications
internes du secteur bancaire. Elle réunit des écrans métiers réutilisables,
des composants communs, une navigation selon les rôles et une configuration
client validée.

**Public cible :** développeurs frontend, équipes produit et organisations
souhaitant prototyper ou intégrer des interfaces de back-office financier.

L'objectif est de limiter la répétition du développement d'interfaces tout
en maintenant la séparation avec la logique métier côté serveur.

## Fonctionnalités

- **Espaces modulaires :** dashboard, comptes, transactions, validations,
  utilisateurs et rôles, rapports et audit.
- **Personnalisation :** thèmes et modules activés selon le client.
- **Configuration validée :** vérification des paramètres par Zod.
- **Navigation selon les rôles :** menus et routes filtrés par permissions.
- **Composants réutilisables :** mises en page, cartes, contrôles et listes.
- **Contrats d'intégration :** adaptateurs pour des API REST externes.
- **Outillage qualité :** Vitest, Playwright et tests d'accessibilité.

### Exemple d'utilisation

Sélectionner les modules utiles à une équipe, personnaliser le thème,
puis connecter les adaptateurs à des API authentifiées. Le navigateur
gère l'interface ; le backend reste responsable de la sécurité et des
règles métier.

## Architecture

Le dépôt utilise un workspace pnpm :

- `apps/starter/` — application React et registre de modules.
- `packages/ui/` — composants d'interface partagés.
- `docs/` — architecture, sécurité et intégration.

**Technologies :** React 18, TypeScript, Vite, Zod, Tailwind CSS, DOMPurify,
Vitest, React Testing Library, Playwright et axe-core.

La configuration de l'interface, la navigation, le rendu et les appels API
sont séparés. Le backend bancaire n'est pas inclus.

## Installation

**Prérequis :** Node.js 20 et pnpm 9, conformément à la CI existante.

```bash
git clone https://github.com/hrmonic/banktestapp.git
cd banktestapp
pnpm install --frozen-lockfile
pnpm dev
```

Commandes utiles :

```bash
pnpm build
pnpm exec vitest run
pnpm test:security
pnpm test:e2e
```

Les navigateurs Playwright doivent être installés pour les tests E2E.
Un workflow GitHub Pages publie une démonstration frontend, sans API
bancaire de production.

## Sécurité et limites

Le dépôt comporte une validation de configuration, une sanitisation HTML,
une gestion de session, des contrôles de navigation et des tests de sécurité.

Limites à prendre en compte :

- Les permissions côté navigateur ne remplacent pas les contrôles API.
- La logique métier, l'identité et les obligations réglementaires doivent
  être prises en charge par les services intégrés.
- Aucune certification de sécurité ni disponibilité en production n'est
  revendiquée.
- La commande `pnpm lint` contient `--fix` et peut modifier le code.
- Les dépendances et configurations doivent être revues avant déploiement.

## Documentation

- [Architecture](docs/architecture.md)
- [Contrats API](docs/api-contracts.md)
- [Durcissement de la sécurité](docs/security-hardening.md)
- [Checklist accessibilité](docs/ui-accessibility-checklist.md)
- [Ancien README conservé](docs/README-archive.md)

## Feuille de route

- [ ] Ajouter des captures réelles de l'application.
- [ ] Publier une démonstration complète avec un backend d'exemple.
- [ ] Séparer la vérification lint des corrections automatiques.
- [ ] Étendre les tests d'intégration avec les API externes.

## Questions fréquentes

### Le projet inclut-il un backend bancaire ?

Non. Il s'agit d'un frontend modulaire avec des contrats d'intégration
à des services externes.

### Peut-on personnaliser l'apparence ?

Oui. La configuration client permet de choisir les thèmes et les modules.

### Le système de rôles frontend garantit-il la sécurité ?

Non. Les endpoints API doivent vérifier les droits indépendamment de l'UI.

### Une entreprise peut-elle utiliser le code commercialement ?

La licence personnalisée impose une autorisation écrite préalable.
Consulter le fichier [LICENSE](LICENSE).

## Licence

**Code source accessible sous conditions personnalisées.** La licence
reproduit des clauses de type MIT modifiées par une restriction commerciale.
Ce n'est **pas** la licence MIT standard ni une licence open source
approuvée par l'OSI.

Copyright © 2026 Réda Touzani.

---

Créé et maintenu par [Réda Touzani](https://github.com/hrmonic).
