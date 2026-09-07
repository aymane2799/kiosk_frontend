import { resolveTenant } from '@/features/tenant/resolvers'
import type { ApiAudience } from '@/shared/api'
import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    identity?: ApiAudience
    requiresAuth?: boolean
  }
}

export interface RouteAuth {
  isUserAuthenticated: boolean
  isAdminAuthenticated: boolean
  tenantSlug: string | null
}

export function resolveGuard(
  to: RouteLocationNormalized,
  auth: RouteAuth,
): true | RouteLocationRaw {
  const routeSlug = resolveTenant(to)

  if (to.meta.identity === 'admin') {
    if (to.name === ROUTE_NAMES.adminLogin) {
      return auth.isAdminAuthenticated ? { name: 'admin-tenants' } : true
    }

    if (to.meta.requiresAuth && !auth.isAdminAuthenticated) {
      return { name: ROUTE_NAMES.adminLogin, query: redirectQuery(to) }
    }

    return true
  }

  if (to.meta.identity === 'tenant') {
    if (to.name === ROUTE_NAMES.tenantLogin) {
      return auth.isUserAuthenticated && routeSlug !== null && auth.tenantSlug == routeSlug
        ? { name: ROUTE_NAMES.tenantHome, params: { tenantSlug: routeSlug } }
        : true
    }

    if (to.meta.requiresAuth) {
      const isWrongTenant = routeSlug !== null && auth.tenantSlug !== routeSlug

      if (!auth.isUserAuthenticated || isWrongTenant) {
        return {
          name: ROUTE_NAMES.tenantLogin,
          params: { tenantSlug: routeSlug ?? '' },
          query: redirectQuery(to),
        }
      }

      return true
    }
  }

  return true
}

function redirectQuery(to: RouteLocationNormalized): Record<string, string> | undefined {
  return to.fullPath && to.path !== '/' ? { redirect: to.fullPath } : undefined
}

export function installAuthGuards(router: Router): void {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    return resolveGuard(to, {
      isUserAuthenticated: auth.isUserAuthenticated,
      isAdminAuthenticated: auth.isAdminAuthenticated,
      tenantSlug: auth.tenantSlug,
    })
  })
}
