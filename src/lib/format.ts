import type { IsoInstant, MinorUnits } from '@/shared/types'

export const DateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })

export function formatDate(iso: IsoInstant | null): string | null {
  if (!iso) return null
  const date = new Date(iso)

  return Number.isNaN(date.getTime()) ? null : DateFormatter.format(date)
}

export function formatPrice(priceCents: MinorUnits, currency: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(priceCents)
}

export function formatBillingPeriod(days: number) {
  if (days === 30) return 'par mois'
  if (days === 365) return 'par an'
  return `tous les ${days} jours`
}
