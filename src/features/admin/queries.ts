import { useQuery } from '@tanstack/vue-query'
import type { AdminTenantResponse, AppUserResponse, PlanResponse } from './types'
import type { ApiError } from '@/shared/types/api-error'
import { adminKeys } from './query-keys'
import { getTenant, getTenantPlans, getTenants, getTenantUsers } from './api'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useGetTenants() {
  return useQuery<AdminTenantResponse[], ApiError>({
    queryKey: adminKeys.tenants(),
    queryFn: getTenants,
  })
}

export function useGetTenant(id: MaybeRefOrGetter<string | null | undefined>) {
  const idValue = computed(() => toValue(id) ?? '')

  return useQuery<AdminTenantResponse, ApiError>({
    queryKey: adminKeys.tenant(idValue.value),
    queryFn: () => getTenant(idValue.value),
    enabled: idValue.value.length > 0,
  })
}

export function useGetTenantUsers(id: MaybeRefOrGetter<string | null | undefined>) {
  const idValue = computed(() => toValue(id) ?? '')

  return useQuery<AppUserResponse[], ApiError>({
    queryKey: adminKeys.tenantUsers(idValue.value),
    queryFn: () => getTenantUsers(idValue.value),
    enabled: idValue.value.length > 0,
  })
}

export function useGetTenantPlans(id: MaybeRefOrGetter<string | null | undefined>) {
  const idValue = computed(() => toValue(id) ?? '')

  return useQuery<PlanResponse[], ApiError>({
    queryKey: adminKeys.tenantPlans(idValue.value),
    queryFn: () => getTenantPlans(idValue.value),
    enabled: idValue.value.length > 0,
  })
}
