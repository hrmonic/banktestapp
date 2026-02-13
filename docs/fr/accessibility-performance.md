## Accessibilité & Performance

### Objectifs d’accessibilité

L’UI vise la **WCAG 2.1 AA** sur les composants clés :

- navigation clavier complète,
- focus visible et ordre logique,
- attributs ARIA appropriés,
- contraste suffisant pour les thèmes par défaut.

### Bonnes pratiques d’accessibilité

- Utiliser un HTML sémantique dans les modules (titres, listes, landmarks).
- Gérer explicitement le focus lors de changements de vues majeurs.
- S’assurer que tous les éléments interactifs sont accessibles au clavier.
- Éviter de véhiculer une information uniquement par la couleur.

Lors de l’extension des modules, suivre les mêmes patterns et réutiliser les composants `@bank/ui` autant que possible.

### Objectifs de performance

Les back‑offices manipulent souvent de **gros volumes de données** et des écrans complexes.  
L’architecture supporte :

- **code splitting par module** – ne charger que le nécessaire,
- **virtualisation des listes** – garder des tableaux volumineux réactifs,
- **caching** (par ex. React Query) pour les appels fréquents,
- **lazy loading** des composants lourds (charts, vues complexes).

### Patterns recommandés

- Découper les routes par module pour profiter des imports lazy.
- Utiliser la virtualisation pour les listes > 1 000 lignes.
- Mettre en cache les requêtes très lues avec des TTL raisonnables.
- Déporter le travail non critique (graphiques secondaires, etc.) via des callbacks idle ou effets en arrière‑plan.

### Checklist – accessibilité

- [ ] Écrans navigables uniquement au clavier.
- [ ] Focus visible sur tous les composants interactifs.
- [ ] Attributs ARIA utilisés lorsque pertinent.
- [ ] Contraste couleur vérifié pour le texte et les éléments clés.
- [ ] Messages d’erreur et instructions clairs dans les formulaires.

### Checklist – performance

- [ ] Code splitting appliqué aux frontières de modules.
- [ ] Grandes listes et tableaux virtualisés.
- [ ] Composants coûteux chargés en lazy.
- [ ] Appels d’API batchés ou mis en cache quand c’est pertinent.
- [ ] Profiling réalisé au moins une fois sur les écrans critiques pour limiter les re‑renders inutiles.
