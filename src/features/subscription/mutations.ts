import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CheckoutRequest, SubscriptionResponse } from './types'
import type { ApiError } from '@/shared/types/api-error'
import { startCheckout } from './api'
import { subscriptionKeys } from './query-keys'

export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation<SubscriptionResponse, ApiError, CheckoutRequest>({
    mutationFn: (body) => startCheckout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.me() })
    },
  })
}
