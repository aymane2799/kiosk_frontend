import type { HexColor, IsoInstant, Uuid } from '@/shared/types'

export interface TenantPublicResponse {
  slug: string
  name: string
  logoUrl: string
  primaryColor: HexColor | null
  secondaryColor: HexColor | null
  providerId: string | null
}

export interface AdminTenantRequest {
  name: string
  slug: string
  logoUrl: string
  primaryColor?: HexColor | null
  secondaryColor?: HexColor | null
  providerId?: string | null
}

export interface AdminTenantResponse {
  id: Uuid
  name: string
  slug: string
  logoUrl: string
  primaryColor?: HexColor | null
  secondaryColor?: HexColor | null
  providerId?: string | null
  createdAt: IsoInstant
}
