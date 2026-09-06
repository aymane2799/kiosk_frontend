import type { Uuid } from '@/shared/types'
import type { ContentSummaryResponse } from '../content/types'

export interface FavoriteSummaryResponse extends ContentSummaryResponse {}

export interface FavoriteRequest {
  contentId: Uuid
}
