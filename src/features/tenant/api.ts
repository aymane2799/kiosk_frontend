import { apiClient } from '@/shared/api'

export async function getTenantConfig(slug: string) {
  const response = await apiClient.get(`tenants/${slug}/config`)

  return response.data
}
