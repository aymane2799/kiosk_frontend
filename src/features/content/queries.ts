import { useQuery } from '@tanstack/vue-query'
import type { ContentDetailResponse, ContentSummaryResponse } from './types'
import { contentKeys } from './query-keys'
import { getCatalog, getContentDetail } from './api'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { ApiError } from '@/shared/types/api-error'

export function useCatalog() {
  return useQuery<ContentSummaryResponse[], ApiError>({
    queryKey: contentKeys.list(),
    queryFn: () => getCatalog(),
  })
}

export function useContentDetail(id: MaybeRefOrGetter<string | null | undefined>) {
  const idValue = computed(() => toValue(id) ?? '')

  return useQuery<ContentDetailResponse, ApiError>({
    queryKey: contentKeys.detail(idValue.value),
    queryFn: () => getContentDetail(idValue.value),
    enabled: idValue.value.length > 0,
  })
}
