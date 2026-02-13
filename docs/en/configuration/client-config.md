## Client configuration – `client.config.json`

### Purpose

`client.config.json` describes how the starter app should behave for a given client and environment:

- branding (name, logo, colors),
- which modules are enabled,
- API endpoints and timeouts,
- auth provider configuration.

It lives in:

- `apps/starter/public/client.config.json`

and is loaded by the app at runtime.

### Minimal example

```json
{
  "branding": {
    "name": "My Bank",
    "logo": "/logo.svg",
    "primaryColor": "#1e40af"
  },
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": false },
    "audit": { "enabled": true }
  },
  "api": {
    "baseUrl": "https://api.mybank.com",
    "timeout": 8000,
    "auth": {
      "type": "oidc",
      "issuer": "https://auth.mybank.com",
      "clientId": "backoffice-app"
    }
  }
}
```

### Fields reference

#### `branding`

- `name` – display name of the bank / client.
- `logo` – path to the logo asset (served from `public/`).
- `primaryColor` – main color used by the theme (can map to CSS variables).

#### `themeKey` (optional)

String identifying the base theme to use, for example:

```json
{
  "themeKey": "default"
}
```

This can be used to select between predefined theme presets.

#### `modules`

Each key is a module `id`, value is an object with at least:

- `enabled` (boolean) – whether the module is enabled for this client/env.

Example:

```json
{
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": true },
    "audit": { "enabled": false }
  }
}
```

The `moduleRegistry` uses this to build the list of enabled modules and feed the router and navigation.

#### `api`

Global API settings:

- `baseUrl` – base URL for the backend API.
- `timeout` – default timeout (ms) for calls.

You can add more keys for your own client:

```json
{
  "api": {
    "baseUrl": "https://api.preprod.mybank.com",
    "timeout": 10000,
    "retries": 2
  }
}
```

#### `auth`

Auth provider configuration. Two modes:

- **OIDC**: `type`, `issuer`, `clientId` (and optionally `mode: "oidc"`).
- **Demo**: `mode: "demo"` to use in-memory / localStorage profiles without a real IdP.

```json
{
  "auth": {
    "type": "oidc",
    "issuer": "https://auth.mybank.com",
    "clientId": "backoffice-app",
    "mode": "demo"
  }
}
```

Depending on your auth library, you can extend this with scopes, redirect URIs, etc.

#### `session` (optional)

Idle timeout and warning before logout:

- `idleTimeoutMinutes` – inactivity duration before logout (e.g. 15).
- `warningBeforeLogoutSeconds` – delay before showing the warning modal (e.g. 60).

### Environment‑specific configs

Typical pattern:

- `client.config.dev.json`
- `client.config.preprod.json`
- `client.config.prod.json`

and a build step or deployment step that renames / injects the right file as `client.config.json`.

### Example setups

#### Sandbox

```json
{
  "branding": {
    "name": "My Bank Sandbox",
    "logo": "/logo-sandbox.svg",
    "primaryColor": "#0ea5e9"
  },
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": true },
    "audit": { "enabled": true }
  },
  "api": {
    "baseUrl": "https://sandbox-api.mybank.com",
    "timeout": 15000
  },
  "auth": {
    "type": "oidc",
    "issuer": "https://sandbox-auth.mybank.com",
    "clientId": "backoffice-sandbox"
  }
}
```

#### Production

```json
{
  "branding": {
    "name": "My Bank",
    "logo": "/logo.svg",
    "primaryColor": "#1e40af"
  },
  "modules": {
    "dashboard": { "enabled": true },
    "transactions": { "enabled": true },
    "users-roles": { "enabled": true },
    "audit": { "enabled": true }
  },
  "api": {
    "baseUrl": "https://api.mybank.com",
    "timeout": 8000
  },
  "auth": {
    "type": "oidc",
    "issuer": "https://auth.mybank.com",
    "clientId": "backoffice-app"
  }
}
```
