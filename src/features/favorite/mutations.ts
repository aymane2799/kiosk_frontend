import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ContentSummaryResponse } from '../content/types'
import type { ApiError } from '@/shared/types/api-error'
import type { Uuid } from '@/shared/types'
import type { FavoriteRequest } from './types'
import { addFavorite, removeFavorite } from './api'
import { favoriteKeys } from './query-keys'
import { contentKeys } from '../content/query-keys'

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation<ContentSummaryResponse, ApiError, FavoriteRequest>({
    mutationFn: (body) => addFavorite(body),
    onSuccess: (_, body) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}

export function useremoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, Uuid>({
    mutationFn: (id) => removeFavorite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all })
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}
