import type { HexColor } from '@/shared/types'
import type { TenantPublicResponse } from './types'

export const FALLBACK_PRIMARY: HexColor = '#5f2ff8'
export const FALLBACK_SECONDARY: HexColor = '#afd4a0'

export function tenantThemeVariables(config: TenantPublicResponse | null) {
  return {
    '--primary': config?.primaryColor ?? FALLBACK_PRIMARY,
    '--secondary': config?.primaryColor ?? FALLBACK_SECONDARY,
  }
}
