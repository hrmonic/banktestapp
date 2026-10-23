# Design system – Tokens et breakpoints

Ce document décrit les **tokens** (couleurs, espacements) et la **stratégie responsive** utilisés dans l'app starter et le package `@bank/ui`. Référence : `tailwind.config.js` à la racine du projet.

---

## 1. Couleurs sémantiques (theme.extend)

| Token     | Usage                      | Valeur / classe Tailwind              |
| --------- | -------------------------- | ------------------------------------- |
| primary   | Actions principales, liens | `#2563eb` (blue-600), hover `#1d4ed8` |
| secondary | Texte secondaire, bordures | `#64748b` (slate-500)                 |
| success   | Succès, validation         | `#10b981` (emerald-500)               |
| error     | Erreurs, alertes           | `#dc2626` (red-600)                   |
| muted     | Texte atténué              | `#64748b`                             |

Les composants privilégient la famille **slate** pour le texte et les fonds (cohérence avec l'audit UI/UX). Les couleurs sémantiques sont étendues dans `theme.extend.colors` pour un usage futur (ex. `bg-primary`, `text-error`).

---

## 2. Breakpoints (Tailwind par défaut)

| Préfixe | Min-width | Usage typique                   |
| ------- | --------- | ------------------------------- |
| `sm`    | 640px     | Petit desktop / grande tablette |
| `md`    | 768px     | Desktop étroit                  |
| `lg`    | 1024px    | Desktop standard                |
| `xl`    | 1280px    | Large desktop                   |

**Conventions dans l'app :**

- **Dashboard** : `md:grid-cols-3`, `md:grid-cols-2` pour les grilles de cartes (une colonne en dessous de 768px).
- **Sidebar** : largeur fixe `w-64` (256px). Sur écrans &lt; 768px (avant `md`), la sidebar est en **drawer** : masquée par défaut, ouverte via le bouton « Menu » en haut à gauche, avec overlay au clic pour fermer.
- **Tests** : vérifier les écrans clés à 360px (mobile), 768px (tablette), 1280px (desktop).

---

## 3. Composants @bank/ui

- **Card** : variantes `default` et `error` (bordure et texte adaptés pour les états d'erreur).
- **Button** : variantes `primary`, `ghost`, `subtle`, `secondary` ; tailles `sm`, `md`, `lg`. Focus ring systématique.
- **PageLayout**, **Placeholder**, **VirtualizedList** : cohérence slate pour bordures et texte.

Voir `packages/ui/src/index.tsx` pour les implémentations.
