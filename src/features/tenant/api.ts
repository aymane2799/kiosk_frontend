import { http } from '@/shared/api/client'
import type { TenantPublicResponse } from './types'

export async function getTenantConfig(slug: string): Promise<TenantPublicResponse> {
  return await http.get<TenantPublicResponse>(`tenants/${slug}/config`)
}
