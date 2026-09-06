import type { ContentTier, IsoInstant, Uuid } from '@/shared/types'

export interface ContentSummaryResponse {
  id: Uuid
  title: string
  excerpt: string | null
  category: string | null
  tier: ContentTier
  publishedAt: IsoInstant | null
  locked: boolean
}

export interface ContentDetailResponse {
  id: Uuid
  title: string
  excerpt: string | null
  body: string | null
  category: string | null
  tier: ContentTier
  publishedAt: IsoInstant | null
}
