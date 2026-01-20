## Getting Started

### Prerequisites

- **Node.js** ≥ 18  
- **pnpm** (recommended; npm/yarn also possible with minor script changes)  
- Evergreen browsers (Chrome, Firefox, Safari, Edge)

Optional:

- Docker / container registry for deployment  
- Reverse proxy or API gateway in front of your backend APIs

### Installation

```bash
# Install dependencies
pnpm install

# Run the demo / starter app
pnpm dev
```

The demo app lives in `apps/starter` and exposes the main feature modules (dashboard, transactions, users & roles, audit).

### Project structure (high‑level)

```text
banktestapp-main/
├── apps/
│   └── starter/            # Demo & integration application
│       ├── src/
│       │   ├── pages/      # Login, 404, Unauthorized, etc.
│       │   ├── modules/    # Business modules (transactions, dashboard, etc.)
│       │   ├── components/ # Layout, ErrorBoundary, Loading, etc.
│       │   └── lib/        # Auth, security, client config
│       └── public/
│           └── client.config.json # Per‑client configuration
│
├── packages/
│   └── ui/                 # Reusable UI library (@bank/ui)
│       └── src/
│           └── index.js
│
├── vite.config.* / vitest.config.mjs / playwright.config.ts
└── package.json / pnpm-workspace.yaml
```

- `apps/starter`: what you typically fork or copy for a client project.  
- `packages/ui`: what you can publish as `@bank/ui` to your registry.

### Running in development

```bash
# Start the starter app (apps/starter)
pnpm dev

# Run unit/component tests
pnpm test

# Run E2E smoke tests (Playwright)
pnpm test:e2e
```

Open the app in your browser, log in using the configured auth provider, and explore modules like Dashboard and Transactions.

### Building for production

```bash
# Global production build (UI + apps)
pnpm build

# Build UI package only
pnpm -F @bank/ui build

# Build the starter app only
cd apps/starter
pnpm build
```

The starter app build outputs static assets in `apps/starter/dist/` which you can serve behind your reverse proxy or API gateway.

### First‑time configuration (`client.config.json`)

Before going to production, you should:

1. Copy `apps/starter/public/client.config.json` and adapt it per environment (dev, preprod, prod).  
2. Adjust:
   - `branding`: bank name, logo, primary color;  
   - `modules`: which modules are enabled;  
   - `api`: base URL and timeouts;  
   - `auth`: your OIDC or auth provider details.

See `configuration/client-config.md` for a full reference.

### Quick checklist for IT / Ops

- [ ] Node.js ≥ 18 available in CI/CD  
- [ ] Build pipeline runs `pnpm install` then `pnpm build`  
- [ ] Static files from `apps/starter/dist/` are deployed behind a reverse proxy  
- [ ] `client.config.json` is versioned or templated per environment  
- [ ] CSP and security headers configured according to your policies  
- [ ] Monitoring / logging of frontend errors wired to your observability stack

```mermaid
flowchart LR
  dev[Developer]
  repo[BankUI_Repo]
  build[CI_Build]
  dist[Static_Assets]
  proxy[Reverse_Proxy]
  users[Enterprise_Users]

  dev --> repo
  repo --> build
  build --> dist
  dist --> proxy
  users --> proxy
  proxy --> dist
```


