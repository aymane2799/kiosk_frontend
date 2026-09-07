import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type {
  AdminTenantRequest,
  AdminTenantResponse,
  PlanAdminRequest,
  PlanResponse,
} from './types'
import type { ApiError } from '@/shared/types/api-error'
import type { Uuid } from '@/shared/types'
import { createTenant, createTenantPlan, updateTenant } from './api'
import { adminKeys } from './query-keys'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation<AdminTenantResponse, ApiError, AdminTenantRequest>({
    mutationFn: (body) => createTenant(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tenants() })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation<AdminTenantResponse, ApiError, { id: Uuid; body: AdminTenantRequest }>({
    mutationFn: ({ id, body }) => updateTenant(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tenants() })
    },
  })
}

export function useCreateTenantPlan(id: MaybeRefOrGetter<string | null | undefined>) {
  const queryClient = useQueryClient()
  const idValue = computed(() => toValue(id) ?? '')

  return useMutation<PlanResponse, ApiError, PlanAdminRequest>({
    mutationFn: (body) => createTenantPlan(idValue.value, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tenantPlans(idValue.value) })
    },
  })
}
