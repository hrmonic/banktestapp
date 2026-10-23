# @bank/ui

Design system léger pour le backoffice (Button, Card, PageLayout, Placeholder, VirtualizedList). Contrat d’usage via les types TypeScript exportés.

## Composants

### Button

Bouton avec variantes et tailles. Accepte les attributs HTML standard (`type`, `disabled`, `onClick`, etc.).

| Prop        | Type                                              | Défaut      | Description                     |
| ----------- | ------------------------------------------------- | ----------- | ------------------------------- |
| `variant`   | `'primary' \| 'ghost' \| 'subtle' \| 'secondary'` | `'primary'` | Style visuel                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Taille                          |
| `className` | `string`                                          | `''`        | Classes Tailwind additionnelles |

### Card

Bloc de contenu avec bordure et ombre. Optionnel : titre, description, variante erreur.

| Prop          | Type                   | Défaut      | Description                      |
| ------------- | ---------------------- | ----------- | -------------------------------- |
| `title`       | `string`               | —           | Titre (h2)                       |
| `description` | `string`               | —           | Sous-titre / description         |
| `variant`     | `'default' \| 'error'` | `'default'` | `error` : bordure et texte rouge |
| `className`   | `string`               | `''`        | Classes additionnelles           |
| `children`    | `ReactNode`            | —           | Contenu                          |

### PageLayout

Conteneur de page avec titre et sous-titre optionnels.

| Prop       | Type        | Description          |
| ---------- | ----------- | -------------------- |
| `title`    | `string`    | Titre principal (h1) |
| `subtitle` | `string`    | Sous-titre           |
| `children` | `ReactNode` | Contenu              |

### Placeholder

Zone en pointillés pour contenu à venir. Texte par défaut : "UI Placeholder".

| Prop       | Type        | Description      |
| ---------- | ----------- | ---------------- |
| `children` | `ReactNode` | Texte ou contenu |

### VirtualizedList\<T\>

Liste virtualisée verticale pour longues listes (performances).

| Prop         | Type                                    | Défaut | Description                               |
| ------------ | --------------------------------------- | ------ | ----------------------------------------- |
| `items`      | `T[]`                                   | —      | Données                                   |
| `itemHeight` | `number`                                | `40`   | Hauteur d’un item (px)                    |
| `overscan`   | `number`                                | `5`    | Nombre d’items rendus au-delà du viewport |
| `renderItem` | `(item: T, index: number) => ReactNode` | —      | Rendu d’un item                           |
| `className`  | `string`                                | `''`   | Classe du conteneur scrollable            |

## Usage

```tsx
import { Button, Card, PageLayout, VirtualizedList } from '@bank/ui';

<Card title="Titre" variant="default">
  <Button variant="primary" size="sm">
    Action
  </Button>
</Card>;
```

Les types sont exportés depuis le package ; pas de Storybook dans ce repo. Voir `src/index.tsx` et `src/VirtualizedList.tsx` pour les implémentations.
