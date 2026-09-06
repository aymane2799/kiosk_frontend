import type { ContentTier, IsoInstant, MinorUnits, SubscriptionStatus, Uuid } from '@/shared/types'

export interface PlanResponse {
  id: Uuid
  name: string
  tier: ContentTier
  price: MinorUnits
  currency: string
  billingPeriod: number
}

export interface PlanAdminRequest {
  name: string
  tier: ContentTier
  price: MinorUnits
  currency: string
  billingPeriod: number
}

export interface CheckoutRequest {
  planId: Uuid
  simulateFailure: boolean
}

export interface SubscriptionResponse {
  id: Uuid
  planId: Uuid
  planName: string
  planTier: ContentTier
  status: SubscriptionStatus
  startedAt: IsoInstant | null
  expiresAt: IsoInstant | null
}

export type MeSubscription = SubscriptionResponse | null
