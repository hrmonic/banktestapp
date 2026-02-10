## Checklist accessibilité pour `@bank/ui`

Cette checklist résume les attentes a11y pour chaque composant
du mini design system `@bank/ui`.

### `Button`

- Fournir un `type` explicite (`button`, `submit`, `reset`) selon le contexte.
- Le label visible doit refléter clairement l’action réalisée.
- Vérifier le contraste texte/fond (> 4.5:1 pour du texte normal).
- S’assurer que les boutons sont atteignables au clavier (tab) et
  activables via `Enter` / `Space`.

### `Card`

- Utiliser `title` pour le titre visible, qui sert de repère principal.
- Optionnellement, ajouter des `aria-label` ou `aria-labelledby`
  pour des cartes sans titre textuel explicite.
- Éviter de mettre des actions critiques uniquement sur un survol souris.

### `PageLayout`

- `title` doit être unique par page et rendu dans un heading (`h1`).
- `subtitle` sert à clarifier le contexte, mais ne doit pas remplacer le titre.
- Vérifier la hiérarchie des titres dans les pages qui l’utilisent
  (`h1` unique, puis `h2`, etc.).

### `VirtualizedList`

- S’assurer que chaque élément rendu conserve la bonne structure
  sémantique (par exemple des `li` dans un `ul`, ou des `tr` dans un `table`).
- Vérifier que l’ordre visuel correspond à l’ordre dans le DOM
  pour ne pas perturber les lecteurs d’écran.
- Fournir des labels explicites ou des intitulés de colonnes
  suffisamment descriptifs.

