import { jwtDecode } from 'jwt-decode'

export interface JwtPayload {
  sub?: string
  tenantId?: string
  role?: string
  exp?: number
  iat?: number
  [claim: string]: unknown
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    return null
  }
}

export function isTokenExpired(token: string, clockSkewSeconds = 30): boolean {
  const exp = decodeJwt(token)?.exp
  if (typeof exp !== 'number') return false

  return Date.now() >= (exp - clockSkewSeconds) * 1000
}
