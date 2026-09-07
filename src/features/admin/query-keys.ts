import type { Uuid } from '@/shared/types'

export const adminKeys = {
  all: ['admin'] as const,
  tenants: () => ['admin', 'tenants'] as const,
  tenant: (id: Uuid) => ['admin', 'tenants', id] as const,
  tenantUsers: (id: Uuid) => ['admin', 'tenants', id, 'users'] as const,
  tenantPlans: (id: Uuid) => ['admin', 'tenants', id, 'plans'] as const,
}
