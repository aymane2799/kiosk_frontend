import { http } from '@/shared/api'
import type { ContentSummaryResponse } from '../content/types'
import type { FavoriteRequest } from './types'

export function getFavorites(): Promise<ContentSummaryResponse[]> {
  return http.get<ContentSummaryResponse[]>('/me/favorites')
}

export function addFavorite(body: FavoriteRequest): Promise<ContentSummaryResponse> {
  return http.post<ContentSummaryResponse>('/me/favorites', body)
}

export function removeFavorite(contentId: string): Promise<void> {
  return http.delete<void>(`/me/favorites/${contentId}`)
}
