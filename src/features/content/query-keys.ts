import type { Uuid } from '@/shared/types'

export const contentKeys = {
  all: ['content'] as const,
  list: () => ['content'] as const,
  detail: (id: Uuid) => ['content', id] as const,
}
