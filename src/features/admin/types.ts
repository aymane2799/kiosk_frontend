import type { IsoInstant, UserRole, Uuid } from '@/shared/types'

export type { AdminTenantResponse, AdminTenantRequest } from '@/features/tenant/types'
export type { PlanAdminRequest, PlanResponse } from '@/features/subscription/types'

export interface AppUserResponse {
  id: Uuid
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: IsoInstant
}
