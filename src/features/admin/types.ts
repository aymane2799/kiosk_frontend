import type { IsoInstant, UserRole, Uuid } from '@/shared/types'

export interface AppUserResponse {
  id: Uuid
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: IsoInstant
}
