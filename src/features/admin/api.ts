import { http } from '@/shared/api'
import type {
  AdminTenantRequest,
  AdminTenantResponse,
  AppUserResponse,
  PlanAdminRequest,
  PlanResponse,
} from './types'
import type { Uuid } from '@/shared/types'

export function getTenants(): Promise<AdminTenantResponse[]> {
  return http.get<AdminTenantResponse[]>('/admin/tenants')
}

export function getTenant(id: Uuid): Promise<AdminTenantResponse> {
  return http.get<AdminTenantResponse>(`/admin/tenants/${id}`)
}

export function createTenant(body: AdminTenantRequest): Promise<AdminTenantResponse> {
  return http.post<AdminTenantResponse>('/admin/tenants', body)
}

export function updateTenant(id: Uuid, body: AdminTenantRequest): Promise<AdminTenantResponse> {
  return http.put<AdminTenantResponse>(`/admin/tenants/${id}`, body)
}

export function getTenantUsers(id: Uuid): Promise<AppUserResponse[]> {
  return http.get<AppUserResponse[]>(`/admin/tenants/${id}/users`)
}

export function getTenantPlans(id: Uuid): Promise<PlanResponse[]> {
  return http.get<PlanResponse[]>(`/admin/tenants/${id}/plans`)
}

export function createTenantPlan(id: Uuid, body: PlanAdminRequest): Promise<PlanResponse> {
  return http.post<PlanResponse>(`/admin/tenants/${id}/plans`, body)
}
