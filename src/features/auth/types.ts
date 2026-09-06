import type { IsoInstant, UserRole, Uuid } from '@/shared/types'

export interface PartnerTokenRequest {
  tenantSlug: string
  externalId: string
  email: string
  firstName: string
  lastName: string
}

export interface PartnerTokenResponse {
  partnerToken: string
}

export interface LoginRequest {
  tenantSlug: string
  partnerToken: string
}

export interface LoginResponse {
  token: string
  userId: Uuid
  tenantId: Uuid
  role: UserRole
}

export interface PartnerIdentity {
  providerId: string
  externalId: string
  email: string
  firstName: string
  lastName: string
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  token: string
  adminId: Uuid
  email: string
  firstName: string
  lastName: string
}
