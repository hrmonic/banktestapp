## Accessibility & Performance

### Accessibility goals

The UI aims for **WCAG 2.1 AA** on core components:

- full keyboard navigation,
- visible and logical focus,
- appropriate ARIA attributes,
- sufficient color contrast for default themes.

### Accessibility practices

- Use semantic HTML in modules (headings, lists, landmarks).
- Keep focus management explicit when navigating between major views.
- Ensure all interactive elements are reachable and operable via keyboard.
- Avoid conveying information by color alone.

When extending modules, follow the same patterns and reuse `@bank/ui` components where possible.

### Performance goals

Back‑office UIs often handle **large datasets** and complex screens.  
The architecture supports:

- **code splitting per module** – only load what is needed,
- **list virtualization** – keep large tables responsive,
- **caching** (e.g. React Query) for frequent API calls,
- **lazy loading** of heavy components (charts, complex views).

### Recommended patterns

- Chunk routes by module to leverage lazy imports.
- Use virtualization for lists with > 1 000 rows.
- Cache read‑heavy queries with sensible TTLs.
- Defer non‑critical work (e.g. secondary graphs) using idle callbacks or background effects.

### Checklist – accessibility

- [ ] Screens navigable with keyboard only.
- [ ] Focus visible on all interactive components.
- [ ] ARIA attributes used where appropriate.
- [ ] Color contrast checked for text and key UI elements.
- [ ] Forms provide clear error messages and instructions.

### Checklist – performance

- [ ] Code splitting applied at module boundaries.
- [ ] Large tables and lists use virtualization.
- [ ] Expensive components loaded lazily.
- [ ] API calls batched or cached when possible.
- [ ] No unnecessary re‑renders on critical pages (profiling done at least once).
