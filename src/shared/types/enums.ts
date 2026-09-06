export const CONTENT_TIERS = ['FREE', 'PREMIUM'] as const
export type ContentTier = (typeof CONTENT_TIERS)[number]

export const USER_ROLES = ['USER'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const ADMIN_ROLES = ['ADMIN'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export const SUBSCRIPTION_STATUSES = [
  'PENDING',
  'ACTIVE',
  'FAILED',
  'SUCCESS',
  'CANCELED',
  'EXPIRED',
]
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export const PAYMENT_STATUSES = ['PENDING', 'SUCCESS', 'FAILED'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export function isPendingSubscription(status: SubscriptionStatus): boolean {
  return status === 'PENDING'
}
