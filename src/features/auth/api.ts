import { http } from '@/shared/api'
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  LoginRequest,
  LoginResponse,
  PartnerTokenRequest,
  PartnerTokenResponse,
} from './types'

export async function createPartnerToken(body: PartnerTokenRequest): Promise<PartnerTokenResponse> {
  return http.post<PartnerTokenResponse>('/auth/mock-partner-token', body)
}

export async function exchangePartnerToken(body: LoginRequest): Promise<LoginResponse> {
  return http.post<LoginResponse>('/auth/login', body)
}

export async function adminLogin(body: AdminLoginRequest): Promise<AdminLoginResponse> {
  return http.post<AdminLoginResponse>('/admin/auth/login', body)
}

export type PartnerAccountInput = Omit<PartnerTokenRequest, 'tenantSlug'>

export async function delegatedLogin({
  tenantSlug,
  account,
}: {
  tenantSlug: string
  account: PartnerAccountInput
}): Promise<LoginResponse> {
  const { partnerToken } = await createPartnerToken({
    tenantSlug,
    externalId: account.externalId,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
  })

  return exchangePartnerToken({ tenantSlug, partnerToken })
}
