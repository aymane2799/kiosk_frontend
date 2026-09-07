import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { TenantPublicResponse } from './types'
import { tenantKeys } from './query-keys'
import { getTenantConfig } from './api'

export function useTenantConfig(slug: MaybeRefOrGetter<string | null | undefined>) {
  const slugValue = computed(() => toValue(slug) ?? '')

  return useQuery<TenantPublicResponse>(
    computed(() => ({
      queryKey: tenantKeys.config(slugValue.value),
      queryFn: () => getTenantConfig(slugValue.value),
      enabled: slugValue.value.length > 0,
    })),
  )
}
