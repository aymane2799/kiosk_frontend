import { audienceForUrl, setTokenGetter } from '@/shared/api'
import { isApiError } from '@/shared/api/errors'
import { useAuthStore } from '@/stores/auth'
import type { Router } from 'vue-router'
import { resolveTenant } from '../tenant/resolvers'
import { ROUTE_NAMES } from '@/router/route-names'

export function installAuth(router: Router): { onError: (error: unknown) => void } {
  const auth = useAuthStore()

  setTokenGetter((audience) => auth.getTokenFor(audience))

  return {
    onError(error) {
      if (!isApiError(error)) return

      const isAuthFailure =
        error.status === 401 || (error.status === 403 && error.code !== 'INSUFFICIENT_TIER')

      if (!isAuthFailure) return

      const audience = audienceForUrl(error.path)
      const current = router.currentRoute.value
      // Capture the slug from the path (or the session) before clearing wipes it.
      const tenantSlug = resolveTenant(current) ?? auth.tenantSlug

      auth.clear(audience)

      if (audience === 'admin') {
        if (current.name !== ROUTE_NAMES.adminLogin)
          void router.push({ name: ROUTE_NAMES.adminLogin })
        return
      }

      if (tenantSlug && current.name !== ROUTE_NAMES.tenantLogin) {
        void router.push({ name: ROUTE_NAMES.tenantLogin, params: { tenantSlug } })
      }
    },
  }
}
