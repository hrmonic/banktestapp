## Testing & Quality

### Overview

The repo ships with a testing and linting setup designed for:

- fast feedback for front‑end changes,  
- smoke coverage of critical flows,  
- consistent code style across modules.

### Tooling

- **Vitest + Testing Library** – unit and component tests (`pnpm test`).  
- **Playwright** – E2E smoke tests (`pnpm test:e2e`).  
- **ESLint + Prettier** – linting and formatting (`pnpm lint`, `pnpm format`).

### Vitest & component tests

Use Vitest to cover:

- routing and bootstrap (`App.jsx`),  
- module activation logic (`moduleRegistry`),  
- critical screens and UI flows in each module.

Typical commands:

```bash
pnpm test
```

You can also run tests in watch mode for local development.

### Playwright & E2E tests

Playwright is configured for **smoke tests**:

- login flow,  
- navigation to Dashboard,  
- basic interaction with key modules.

Command:

```bash
pnpm test:e2e
```

Extend E2E tests to cover:

- permission checks (users with/without roles),  
- happy paths on Transactions and Audit,  
- regression checks for critical flows before releases.

### Linting & formatting

Use ESLint and Prettier to keep the codebase consistent:

- enforce modern React/JS patterns,  
- avoid common mistakes (unused variables, unsafe patterns),  
- standardize formatting so diffs stay small and readable.

Integrate linting into CI so that pull requests must pass before merging.

### Adding tests for new modules

When you add a module (e.g. `limits`):

1. **Unit/component tests**
   - test its `module.js` contract (id/basePath/sidebarItems),  
   - test main views (rendering, basic interactions).
2. **Integration tests**
   - verify that the module is enabled/disabled via `client.config.json`.  
3. **E2E (optional but recommended)**
   - add a minimal journey: login → navigate to the module → perform one key action.

### Code review checklist for modules

- [ ] Module exports a valid contract (`id`, `name`, `basePath`, `routes`, `sidebarItems`).  
- [ ] Routes use lazy loading if the module is heavy.  
- [ ] API calls go through an adapter, not directly through `fetch` or raw clients.  
- [ ] Basic tests exist (Vitest) and pass.  
- [ ] Optional: E2E smoke for business‑critical modules.  
- [ ] UI uses `@bank/ui` components where appropriate.  
- [ ] No hard‑coded environment‑specific URLs (use `client.config.json` / config).


