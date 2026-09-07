import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import type { AdminLoginRequest, AdminLoginResponse, LoginResponse } from './types'
import { adminLogin, delegatedLogin, type PartnerAccountInput } from './api'

export interface TenantLoginVariables {
  tenantSlug: string
  account: PartnerAccountInput
}

export function useTenantLogin() {
  const auth = useAuthStore()

  return useMutation<LoginResponse, Error, TenantLoginVariables>({
    mutationFn: (body) => delegatedLogin(body),
    onSuccess: (response, { tenantSlug }) => {
      auth.startUserSession({
        token: response.token,
        userId: response.userId,
        tenantId: response.tenantId,
        tenantSlug,
        role: response.role,
      })
    },
  })
}

export function useAdminLogin() {
  const auth = useAuthStore()

  return useMutation<AdminLoginResponse, Error, AdminLoginRequest>({
    mutationFn: (body) => adminLogin(body),
    onSuccess: (response) => {
      auth.startAdminSession({
        token: response.token,
        admin: response.adminId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      })
    },
  })
}
