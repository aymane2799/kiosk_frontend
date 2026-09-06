export type ApiAudience = 'tenant' | 'admin'
type TokenGetter = (audience: ApiAudience) => string | null

let tokenGetter: TokenGetter = () => null

export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter
}

export function getToken(audience: ApiAudience) {
  return tokenGetter(audience)
}

export function audienceForUrl(url: string | undefined) {
  if (!url) return 'tenant'

  // Matches "/admin/…" and "admin/…"; also covers the public "/admin/auth/login".
  return /(^|\/)admin(\/|$)/.test(url) ? 'admin' : 'tenant'
}
