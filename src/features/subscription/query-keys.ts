import type { Uuid } from '@/shared/types'

export const subscriptionKeys = {
  all: ['subscription'] as const,
  me: () => ['subscription', 'me'] as const,
  plans: (tenantId: Uuid) => ['plans', tenantId] as const,
}
