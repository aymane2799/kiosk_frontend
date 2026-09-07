import type { IsoInstant } from '@/shared/types'

export const DateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export function formatDate(iso: IsoInstant | null): string | null {
  if (!iso) return null
  const date = new Date(iso)

  return Number.isNaN(date.getTime()) ? null : DateFormatter.format(date)
}
