# Déploiement de la démo (Live demo)

Objectif : avoir une URL stable (ex. Vercel ou Netlify) pour la démo, visible en un clic depuis le README.

## Option 1 : Vercel (recommandé)

Un `vercel.json` à la racine du repo définit déjà `buildCommand` et `outputDirectory` ; il suffit de connecter le dépôt.

1. Créez un compte sur [vercel.com](https://vercel.com) et connectez le dépôt GitHub `hrmonic/banktestapp`.
2. **Build & Output :** (souvent détectés via `vercel.json`)
   - **Root Directory** : racine du repo (`.`).
   - **Build Command** : `pnpm install && pnpm build`
   - **Output Directory** : `apps/starter/dist`
3. Déployez. Vercel fournit une URL du type `https://banktestapp-xxx.vercel.app`.
4. **Mettez à jour le README** : remplacez `https://banktestapp-demo.vercel.app` par votre URL réelle dans les badges et liens « Voir la démo ».

## Option 2 : Netlify

1. Connectez le dépôt sur [netlify.com](https://netlify.com).
2. **Build settings :**
   - **Build command** : `pnpm install && pnpm build`
   - **Publish directory** : `apps/starter/dist`
3. Après le premier déploiement, mettez à jour l’URL dans le README comme ci-dessus.

## Option 3 : GitHub Pages (via GitHub Actions)

Pour un déploiement statique sur GitHub Pages, configurez un workflow qui build l’app et pousse le contenu de `apps/starter/dist` vers la branche (voir workflow ci-dessous) (ou utilisez GitHub Actions « static site »). Puis indiquez l’URL `https://hrmonic.github.io/banktestapp` (ou le path configuré) dans le README.

Le workflow `.github/workflows/deploy-pages.yml` build et publie automatiquement à chaque push sur `main`. **Activation :** dépôt GitHub → **Settings** → **Pages** → **Source** = **GitHub Actions**. La démo sera alors à **https://hrmonic.github.io/banktestapp/** — mettez à jour cette URL dans le README à la place de `https://banktestapp-demo.vercel.app`.

---

**Important :** une fois l’URL de la démo connue, remplacez partout dans le README la valeur `https://banktestapp-demo.vercel.app` par cette URL pour que le badge et les liens « Live demo » fonctionnent.
