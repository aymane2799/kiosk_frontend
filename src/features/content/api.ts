import { http } from '@/shared/api'
import type { ContentDetailResponse, ContentSummaryResponse } from './types'
import type { Uuid } from '@/shared/types'

export function getCatalog(): Promise<ContentSummaryResponse[]> {
  return http.get<ContentSummaryResponse[]>('/content')
}

export function getContentDetail(id: Uuid): Promise<ContentDetailResponse> {
  return http.get<ContentDetailResponse>(`/content/${id}`)
}
