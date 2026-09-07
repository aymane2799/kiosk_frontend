# Kiosk Frontend

**English** · [Français](./README.fr.md)

A multi-tenant content **kiosk** web application built with Vue 3, Vite and TypeScript.
It serves two distinct audiences from a single SPA:

- **Tenant users** browse a per-tenant, white-labelled content catalog, mark favorites,
  and subscribe to paid plans through a checkout flow.
- **Platform admins** manage tenants (create / edit / inspect) and their plans and users.

Each tenant gets its own URL space (`/t/<tenant-slug>/…`), branding (logo, primary /
secondary colors) and content tiers (`FREE` / `PREMIUM`).

---

## Tech stack

| Concern          | Choice                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| Framework        | [Vue 3](https://vuejs.org/) (`<script setup>`, Composition API)                       |
| Build tool       | [Vite](https://vite.dev/)                                                             |
| Language         | TypeScript (`vue-tsc` for type-checking)                                              |
| Routing          | [Vue Router](https://router.vuejs.org/)                                               |
| Client state     | [Pinia](https://pinia.vuejs.org/)                                                     |
| Server state     | [TanStack Query](https://tanstack.com/query) (`@tanstack/vue-query`)                  |
| Data tables      | [TanStack Table](https://tanstack.com/table)                                          |
| HTTP             | [Axios](https://axios-http.com/) (thin `http` wrapper + interceptors)                 |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css`                        |
| UI primitives    | [reka-ui](https://reka-ui.com/), `class-variance-authority`, custom `components/ui/*` |
| Icons            | `@lucide/vue`                                                                         |
| Auth tokens      | `jwt-decode`, tokens persisted in browser storage                                     |
| Linting / format | ESLint 10, oxlint, Prettier                                                           |

---

## Prerequisites

- **Node.js** `^22.18.0` or `>=24.12.0` (see `engines` in `package.json`)
- **npm** (the repo ships a `package-lock.json`)
- A running instance of the **Kiosk backend API** (this repo is frontend-only)

---

## Getting started

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment

Copy the example env file and point it at your backend:

```sh
cp .env.example .env
```

```dotenv
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

| Variable            | Required | Description                                                                 |
| ------------------- | -------- | --------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | yes      | Base URL of the Kiosk backend API. All Axios requests are prefixed with it. |

> Vite only exposes variables prefixed with `VITE_` to client code. Restart the dev
> server after changing `.env`.

### 3. Run the dev server

```sh
npm run dev
```

Vite prints a local URL (default `http://localhost:5173`). The app redirects `/` to the
admin tenants list. To open a tenant storefront, navigate to `/t/<tenant-slug>`.

---

## Available scripts

| Command              | What it does                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `npm run dev`        | Start Vite dev server with HMR and Vue DevTools.                       |
| `npm run build`      | Type-check (`vue-tsc`) **and** build the production bundle to `dist/`. |
| `npm run build-only` | Build without type-checking.                                           |
| `npm run preview`    | Serve the built `dist/` locally to smoke-test the production build.    |
| `npm run type-check` | Run `vue-tsc` project type-checking only.                              |
| `npm run test:unit`  | Run the Vitest unit test suite.                                        |
| `npm run lint`       | Run oxlint then ESLint, both with `--fix`.                             |
| `npm run format`     | Format `src/` with Prettier.                                           |

### Production build

```sh
npm run build
npm run preview   # optional: verify the output
```

The `dist/` folder is a static SPA. Deploy it behind any static host / CDN, and make
sure the host rewrites unknown paths to `index.html` (history-mode routing).

---

## Project structure

```
src/
├── main.ts                 # App bootstrap: Pinia, Router, Vue Query, auth wiring
├── App.vue                 # Root — just <RouterView/>
├── assets/                 # Global CSS (Tailwind entry: main.css)
│
├── router/
│   ├── index.ts            # Route tree (tenant + admin), lazy-loaded pages
│   ├── route-names.ts      # Central ROUTE_NAMES map + RouteName type
│   └── guards.ts           # Auth guards: resolveGuard() + installAuthGuards()
│
├── layouts/                # Shell layouts per section
│   ├── DefaultTenantLayout.vue
│   ├── AuthLayout.vue          # tenant login
│   ├── AdminLayout.vue
│   └── AdminAuthLayout.vue     # admin login
│
├── stores/                 # Pinia stores (client state)
│   ├── auth.ts             # user + admin sessions, token access, persistence
│   └── tenant.ts           # resolved tenant slug + public config / theme colors
│
├── features/               # Feature-sliced modules
│   ├── auth/               # login flows (tenant delegated login, admin login),
│   │                       #   JWT decode, session storage, installAuth()
│   ├── tenant/             # public tenant config, slug resolver, theming
│   ├── content/            # catalog + content detail (queries, api, pages)
│   ├── favorite/           # favorites list + toggle
│   ├── subscription/       # plans, checkout, "my subscription"
│   └── admin/              # admin tenant CRUD pages
│       └── */
│           ├── api.ts          # HTTP calls
│           ├── queries.ts      # useQuery / useMutation wrappers
│           ├── query-keys.ts   # TanStack Query key factories
│           ├── types.ts        # request / response DTOs
│           └── pages/          # route components
│
├── components/
│   ├── ui/                 # design-system primitives (button, card, field, input…)
│   ├── Logo.vue
│   └── ...
│
├── shared/
│   ├── api/                # axios client, http helpers, token registry, error mapping
│   ├── config/env.ts       # typed access to import.meta.env
│   └── types/              # cross-cutting types + enums (ContentTier, roles, …)
│
└── lib/                    # small utilities (cn(), local-storage helpers)
```

### Routing overview

| Path                                | Name                    | Auth   | Purpose                         |
| ----------------------------------- | ----------------------- | ------ | ------------------------------- |
| `/`                                 | —                       | —      | Redirects to admin tenants list |
| `/t/:tenantSlug`                    | `tenant-home`           | public | Tenant landing page             |
| `/t/:tenantSlug/login`              | `tenant-login`          | public | Tenant user login (delegated)   |
| `/t/:tenantSlug/catalog`            | `tenant-catalog`        | user   | Content catalog                 |
| `/t/:tenantSlug/catalog/:contentId` | `tenant-content-detail` | user   | Single content item             |
| `/t/:tenantSlug/favorites`          | `tenant-favorites`      | user   | Favorited content               |
| `/t/:tenantSlug/plans`              | `tenant-plans`          | public | Plans + checkout                |
| `/admin/login`                      | `admin-login`           | public | Admin login                     |
| `/admin/tenants`                    | `admin-tenants`         | admin  | Tenant list                     |
| `/admin/tenants/create`             | `admin-create-tenants`  | admin  | Create tenant                   |
| `/admin/tenants/:tenantId`          | `admin-tenant-detail`   | admin  | Tenant detail                   |
| `/admin/tenants/:tenantId/edit`     | `admin-update-tenants`  | admin  | Edit tenant                     |

Route `meta` carries `identity: 'tenant' | 'admin'` and `requiresAuth`. The global
`beforeEach` guard (`router/guards.ts`) redirects unauthenticated users to the correct
login page and blocks cross-tenant access.

---

## How auth works

- Two independent sessions live side by side: **user** (tenant) and **admin**. Each is
  persisted to browser storage and rehydrated on load (`stores/auth.ts`).
- The Axios request interceptor (`shared/api/client.ts`) attaches
  `Authorization: Bearer <token>`, choosing the token by inspecting the request URL —
  URLs matching `/admin/…` use the admin token, everything else uses the tenant token
  (`shared/api/tokens.ts`).
- Tenant login is a **delegated / partner** flow: the frontend requests a mock partner
  token and exchanges it for a session token (`features/auth/api.ts` →
  `delegatedLogin`).
- On a `401` (or non-tier `403`), `installAuth()` clears the relevant session and pushes
  the user to the matching login route.

## Data fetching

Server state goes through TanStack Query. Global defaults (in `main.ts`): `retry: 1`,
`staleTime: 30s`, no refetch on window focus. Query and mutation errors funnel through
the shared `onError` handler for auth handling. Each feature owns its `query-keys.ts`
factory and `queries.ts` hooks.

## Theming

`stores/tenant.ts` holds the resolved tenant's public config. `features/tenant/theme.ts`
maps it to CSS custom properties (`--primary`, `--secondary`), falling back to default
brand colors when a tenant has none.

---

## Testing

```sh
npm run test:unit          # run once (watch mode is Vitest default when interactive)
```

Tests live in `src/__tests__/` and alongside features. Config: `vitest.config.ts`
(jsdom environment).

## Linting & formatting

```sh
npm run lint               # oxlint + eslint, autofix
npm run format             # prettier on src/
```

Editor config is in `.editorconfig`, `.prettierrc.json`, `eslint.config.ts`,
`.oxlintrc.json`. Recommended VS Code extensions are listed in `.vscode/extensions.json`
(Vue **Volar** — disable Vetur).

---

## Troubleshooting

| Symptom                               | Likely cause / fix                                              |
| ------------------------------------- | --------------------------------------------------------------- |
| All requests fail / `Network Error`   | `VITE_API_BASE_URL` unset or backend not running. Check `.env`. |
| 404 on refresh in production          | Static host not rewriting to `index.html` (history mode).       |
| `engine` warning on `npm install`     | Node version outside the supported range — upgrade Node.        |
| Env change not picked up              | Restart `npm run dev` after editing `.env`.                     |
| Type errors only in build, not editor | Run `npm run type-check`; ensure Volar is active in the editor. |
