import type { RouteLocationNormalizedGeneric } from 'vue-router'

export function resolveTenant(
  route: Pick<RouteLocationNormalizedGeneric, 'params'>,
): string | null {
  const raw = route.params.tenantSlug
  const slug = Array.isArray(raw) ? raw[0] : raw

  return typeof slug === 'string' && slug.length > 0 ? slug : null
}
