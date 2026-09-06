import type { Uuid } from '@/shared/types'

export const adminKeys = {
  all: ['admin'] as const,
  tenants: () => ['admin', 'tenants'] as const,
  tenantsUsers: (id: Uuid) => ['admin', 'tenants', id, 'users'] as const,
  tenantsPlans: (id: Uuid) => ['admin', 'tenants', id, 'plans'] as const,
}
