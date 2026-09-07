import { useQuery } from '@tanstack/vue-query'
import { favoriteKeys } from './query-keys'
import { getFavorites } from './api'
import type { ContentSummaryResponse } from '../content/types'
import type { ApiError } from '@/shared/types/api-error'

export function useGetFavorites() {
  return useQuery<ContentSummaryResponse[], ApiError>(() => ({
    queryKey: favoriteKeys.list(),
    queryFn: () => getFavorites(),
  }))
}
