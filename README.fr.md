# Kiosk Frontend

[English](./README.md) · **Français**

Application web **kiosk** de contenu multi-tenant, construite avec Vue 3, Vite et
TypeScript. Elle sert deux publics distincts depuis une seule SPA :

- Les **utilisateurs d'un tenant** parcourent un catalogue de contenu en marque blanche
  propre à leur tenant, ajoutent des favoris et souscrivent à des offres payantes via un
  tunnel de paiement.
- Les **administrateurs de la plateforme** gèrent les tenants (création / édition /
  consultation) ainsi que leurs offres et leurs utilisateurs.

Chaque tenant dispose de son propre espace d'URL (`/t/<tenant-slug>/…`), de son image de
marque (logo, couleurs primaire / secondaire) et de ses niveaux de contenu
(`FREE` / `PREMIUM`).

---

## Stack technique

| Domaine             | Choix                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Framework           | [Vue 3](https://vuejs.org/) (`<script setup>`, Composition API)                           |
| Outil de build      | [Vite](https://vite.dev/)                                                                 |
| Langage             | TypeScript (`vue-tsc` pour la vérification de types)                                      |
| Routing             | [Vue Router](https://router.vuejs.org/)                                                   |
| État client         | [Pinia](https://pinia.vuejs.org/)                                                         |
| État serveur        | [TanStack Query](https://tanstack.com/query) (`@tanstack/vue-query`)                      |
| Tableaux de données | [TanStack Table](https://tanstack.com/table)                                              |
| HTTP                | [Axios](https://axios-http.com/) (wrapper `http` léger + intercepteurs)                   |
| Styles              | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css`                            |
| Primitives UI       | [reka-ui](https://reka-ui.com/), `class-variance-authority`, `components/ui/*` sur mesure |
| Icônes              | `@lucide/vue`                                                                             |
| Jetons d'auth       | `jwt-decode`, jetons persistés dans le stockage du navigateur                             |
| Lint / formatage    | ESLint 10, oxlint, Prettier                                                               |

---

## Prérequis

- **Node.js** `^22.18.0` ou `>=24.12.0` (voir `engines` dans `package.json`)
- **npm** (le dépôt fournit un `package-lock.json`)
- Une instance fonctionnelle de l'**API backend Kiosk** (ce dépôt ne contient que le frontend)

---

## Démarrage

### 1. Installer les dépendances

```sh
npm install
```

### 2. Configurer l'environnement

Copiez le fichier d'exemple et pointez-le vers votre backend :

```sh
cp .env.example .env
```

```dotenv
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

| Variable            | Requise | Description                                                                      |
| ------------------- | ------- | -------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | oui     | URL de base de l'API backend Kiosk. Toutes les requêtes Axios en sont préfixées. |

> Vite n'expose au code client que les variables préfixées par `VITE_`. Redémarrez le
> serveur de développement après toute modification de `.env`.

### 3. Lancer le serveur de développement

```sh
npm run dev
```

Vite affiche une URL locale (par défaut `http://localhost:5173`). L'application redirige
`/` vers la liste des tenants côté admin. Pour ouvrir la vitrine d'un tenant, accédez à
`/t/<tenant-slug>`.

---

## Scripts disponibles

| Commande             | Rôle                                                                               |
| -------------------- | ---------------------------------------------------------------------------------- |
| `npm run dev`        | Démarre le serveur Vite avec HMR et Vue DevTools.                                  |
| `npm run build`      | Vérifie les types (`vue-tsc`) **et** produit le bundle de production dans `dist/`. |
| `npm run build-only` | Build sans vérification de types.                                                  |
| `npm run preview`    | Sert le `dist/` généré en local pour tester le build de production.                |
| `npm run type-check` | Vérification de types du projet via `vue-tsc` uniquement.                          |
| `npm run test:unit`  | Exécute la suite de tests unitaires Vitest.                                        |
| `npm run lint`       | Lance oxlint puis ESLint, tous deux avec `--fix`.                                  |
| `npm run format`     | Formate `src/` avec Prettier.                                                      |

### Build de production

```sh
npm run build
npm run preview   # optionnel : vérifier le résultat
```

Le dossier `dist/` est une SPA statique. Déployez-le derrière n'importe quel hébergeur
statique / CDN, en veillant à ce que l'hébergeur réécrive les chemins inconnus vers
`index.html` (routing en mode history).

---

## Structure du projet

```
src/
├── main.ts                 # Bootstrap : Pinia, Router, Vue Query, câblage de l'auth
├── App.vue                 # Racine — uniquement <RouterView/>
├── assets/                 # CSS global (point d'entrée Tailwind : main.css)
│
├── router/
│   ├── index.ts            # Arbre de routes (tenant + admin), pages en lazy-load
│   ├── route-names.ts      # Map centrale ROUTE_NAMES + type RouteName
│   └── guards.ts           # Guards d'auth : resolveGuard() + installAuthGuards()
│
├── layouts/                # Layouts de coquille par section
│   ├── DefaultTenantLayout.vue
│   ├── AuthLayout.vue          # login tenant
│   ├── AdminLayout.vue
│   └── AdminAuthLayout.vue     # login admin
│
├── stores/                 # Stores Pinia (état client)
│   ├── auth.ts             # sessions user + admin, accès aux jetons, persistance
│   └── tenant.ts           # slug résolu + config publique / couleurs de thème du tenant
│
├── features/               # Modules en découpage par fonctionnalité
│   ├── auth/               # tunnels de login (login délégué tenant, login admin),
│   │                       #   décodage JWT, stockage de session, installAuth()
│   ├── tenant/             # config publique du tenant, résolveur de slug, thématisation
│   ├── content/            # catalogue + détail de contenu (queries, api, pages)
│   ├── favorite/           # liste de favoris + bascule
│   ├── subscription/       # offres, checkout, « mon abonnement »
│   └── admin/              # pages CRUD des tenants côté admin
│       └── */
│           ├── api.ts          # appels HTTP
│           ├── queries.ts      # wrappers useQuery / useMutation
│           ├── query-keys.ts   # fabriques de clés TanStack Query
│           ├── types.ts        # DTO requête / réponse
│           └── pages/          # composants de route
│
├── components/
│   ├── ui/                 # primitives du design system (button, card, field, input…)
│   ├── Logo.vue
│   └── ...
│
├── shared/
│   ├── api/                # client axios, helpers http, registre de jetons, mapping d'erreurs
│   ├── config/env.ts       # accès typé à import.meta.env
│   └── types/              # types transverses + enums (ContentTier, rôles, …)
│
└── lib/                    # petits utilitaires (cn(), helpers de local storage)
```

### Vue d'ensemble du routing

| Chemin                              | Nom                     | Auth        | Rôle                                     |
| ----------------------------------- | ----------------------- | ----------- | ---------------------------------------- |
| `/`                                 | —                       | —           | Redirige vers la liste des tenants admin |
| `/t/:tenantSlug`                    | `tenant-home`           | public      | Page d'accueil du tenant                 |
| `/t/:tenantSlug/login`              | `tenant-login`          | public      | Login utilisateur tenant (délégué)       |
| `/t/:tenantSlug/catalog`            | `tenant-catalog`        | utilisateur | Catalogue de contenu                     |
| `/t/:tenantSlug/catalog/:contentId` | `tenant-content-detail` | utilisateur | Élément de contenu unique                |
| `/t/:tenantSlug/favorites`          | `tenant-favorites`      | utilisateur | Contenu mis en favori                    |
| `/t/:tenantSlug/plans`              | `tenant-plans`          | public      | Offres + checkout                        |
| `/admin/login`                      | `admin-login`           | public      | Login admin                              |
| `/admin/tenants`                    | `admin-tenants`         | admin       | Liste des tenants                        |
| `/admin/tenants/create`             | `admin-create-tenants`  | admin       | Créer un tenant                          |
| `/admin/tenants/:tenantId`          | `admin-tenant-detail`   | admin       | Détail d'un tenant                       |
| `/admin/tenants/:tenantId/edit`     | `admin-update-tenants`  | admin       | Éditer un tenant                         |

Le `meta` des routes porte `identity: 'tenant' | 'admin'` et `requiresAuth`. Le guard
global `beforeEach` (`router/guards.ts`) redirige les utilisateurs non authentifiés vers
la bonne page de login et bloque l'accès inter-tenant.

---

## Fonctionnement de l'authentification

- Deux sessions indépendantes coexistent : **user** (tenant) et **admin**. Chacune est
  persistée dans le stockage du navigateur et réhydratée au chargement (`stores/auth.ts`).
- L'intercepteur de requête Axios (`shared/api/client.ts`) ajoute
  `Authorization: Bearer <token>`, en choisissant le jeton selon l'URL de la requête —
  les URL correspondant à `/admin/…` utilisent le jeton admin, toutes les autres le
  jeton tenant (`shared/api/tokens.ts`).
- Le login tenant est un flux **délégué / partenaire** : le frontend demande un mock
  partner token et l'échange contre un jeton de session (`features/auth/api.ts` →
  `delegatedLogin`).
- Sur un `401` (ou un `403` hors niveau de contenu), `installAuth()` efface la session
  concernée et redirige vers la route de login correspondante.

## Récupération des données

L'état serveur passe par TanStack Query. Valeurs par défaut globales (dans `main.ts`) :
`retry: 1`, `staleTime: 30s`, pas de refetch au focus de la fenêtre. Les erreurs de
query et de mutation passent par le handler `onError` partagé pour la gestion de l'auth.
Chaque feature possède sa fabrique `query-keys.ts` et ses hooks `queries.ts`.

## Thématisation

`stores/tenant.ts` contient la config publique du tenant résolu.
`features/tenant/theme.ts` la mappe vers des propriétés CSS personnalisées
(`--primary`, `--secondary`), avec un repli sur les couleurs de marque par défaut quand
un tenant n'en définit pas.

---

## Tests

```sh
npm run test:unit
```

Les tests se trouvent dans `src/__tests__/` et à côté des features. Configuration :
`vitest.config.ts` (environnement jsdom).

## Lint & formatage

```sh
npm run lint               # oxlint + eslint, correction automatique
npm run format             # prettier sur src/
```

La configuration éditeur est dans `.editorconfig`, `.prettierrc.json`, `eslint.config.ts`,
`.oxlintrc.json`. Les extensions VS Code recommandées sont listées dans
`.vscode/extensions.json` (Vue **Volar** — désactiver Vetur).

---

## Dépannage

| Symptôme                                          | Cause probable / solution                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| Toutes les requêtes échouent / `Network Error`    | `VITE_API_BASE_URL` non défini ou backend non démarré. Vérifiez `.env`.    |
| 404 au rafraîchissement en production             | L'hébergeur statique ne réécrit pas vers `index.html` (mode history).      |
| Avertissement `engine` lors du `npm install`      | Version de Node hors de la plage supportée — mettez Node à jour.           |
| Changement de `.env` non pris en compte           | Redémarrez `npm run dev` après édition de `.env`.                          |
| Erreurs de types au build mais pas dans l'éditeur | Lancez `npm run type-check` ; vérifiez que Volar est actif dans l'éditeur. |
