import { queryOptions, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { MeSubscription, PlanResponse } from './types'
import type { ApiError } from '@/shared/types/api-error'
import { subscriptionKeys } from './query-keys'
import { getMysubscription, getPlans } from './api'
import { isPendingSubscription } from '@/shared/types'

export function usePlans(slug: MaybeRefOrGetter<string | null | undefined>) {
  const slugValue = computed(() => toValue(slug) ?? '')

  return useQuery<PlanResponse[], ApiError>(
    computed(() => ({
      queryKey: subscriptionKeys.plans(slugValue.value),
      queryFn: () => getPlans(slugValue.value),
      enabled: slugValue.value.length > 0,
    })),
  )
}

export function useMySubscription(enabled: MaybeRefOrGetter<boolean> = true) {
  return useQuery<MeSubscription, ApiError>(
    computed(() => ({
      queryKey: subscriptionKeys.me(),
      queryFn: getMysubscription,
      enabled: toValue(enabled),
      refetchInterval(query) {
        const subscription = query.state.data ?? null

        if (subscription && isPendingSubscription(subscription.status)) return 1500
        return false
      },
    })),
  )
}
