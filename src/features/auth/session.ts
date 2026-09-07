import type { UserRole, Uuid } from '@/shared/types'

export interface UserSession {
  token: string
  userId: Uuid
  tenantId: Uuid
  tenantSlug: string
  role: UserRole
}

export interface AdminSession {
  token: string
  admin: Uuid
  email: string
  firstName: string
  lastName: string
}
