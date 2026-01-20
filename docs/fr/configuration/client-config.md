## Configuration client – `client.config.json`

### Rôle

`client.config.json` décrit le comportement de l’app starter pour un client et un environnement donnés :

- branding (nom, logo, couleurs),  
- modules activés,  
- endpoints et timeouts d’API,  
- configuration du provider d’authentification.

Localisation :

- `apps/starter/public/client.config.json`

et chargé par l’app au runtime.

### Exemple minimal

```json
{
  "branding": {
    "name": "Ma Banque",
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
    "baseUrl": "https://api.mabanque.com",
    "timeout": 8000,
    "auth": {
      "type": "oidc",
      "issuer": "https://auth.mabanque.com",
      "clientId": "backoffice-app"
    }
  }
}
```

### Référence des champs

#### `branding`

- `name` – nom affiché de la banque / du client.  
- `logo` – chemin vers le logo (servi depuis `public/`).  
- `primaryColor` – couleur principale du thème (peut alimenter des variables CSS).

#### `themeKey` (optionnel)

Chaîne identifiant le thème de base à utiliser, par exemple :

```json
{
  "themeKey": "default"
}
```

Utile pour sélectionner des presets de thèmes.

#### `modules`

Chaque clé est un `id` de module, valeur = objet avec au minimum :

- `enabled` (booléen) – indique si le module est activé pour ce client/env.

Exemple :

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

Le `moduleRegistry` utilise cette section pour construire la liste des modules activés et alimenter router + navigation.

#### `api`

Paramètres globaux d’API :

- `baseUrl` – URL de base de l’API backend.  
- `timeout` – timeout par défaut (ms).

Vous pouvez ajouter vos propres clés :

```json
{
  "api": {
    "baseUrl": "https://api.preprod.mabanque.com",
    "timeout": 10000,
    "retries": 2
  }
}
```

#### `auth`

Configuration du provider d’authentification, typiquement OIDC :

```json
{
  "auth": {
    "type": "oidc",
    "issuer": "https://auth.mabanque.com",
    "clientId": "backoffice-app"
  }
}
```

À étendre selon votre librairie d’auth (scopes, redirect URIs, etc.).

### Configs par environnement

Pattern typique :

- `client.config.dev.json`  
- `client.config.preprod.json`  
- `client.config.prod.json`

et une étape de build ou de déploiement qui renomme / injecte le bon fichier en `client.config.json`.

### Exemples de setups

#### Sandbox

```json
{
  "branding": {
    "name": "Ma Banque Sandbox",
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
    "baseUrl": "https://sandbox-api.mabanque.com",
    "timeout": 15000
  },
  "auth": {
    "type": "oidc",
    "issuer": "https://sandbox-auth.mabanque.com",
    "clientId": "backoffice-sandbox"
  }
}
```

#### Production

```json
{
  "branding": {
    "name": "Ma Banque",
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
    "baseUrl": "https://api.mabanque.com",
    "timeout": 8000
  },
  "auth": {
    "type": "oidc",
    "issuer": "https://auth.mabanque.com",
    "clientId": "backoffice-app"
  }
}
```


