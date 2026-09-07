import { http } from '@/shared/api'
import type { CheckoutRequest, MeSubscription, PlanResponse, SubscriptionResponse } from './types'

export function getPlans(slug: string): Promise<PlanResponse[]> {
  return http.get<PlanResponse[]>(`/tenants/${slug}/plans`)
}

export function getMysubscription(): Promise<MeSubscription> {
  return http.get<MeSubscription>('/me/subscription')
}

export function startCheckout(body: CheckoutRequest): Promise<SubscriptionResponse> {
  return http.post<SubscriptionResponse>('/subscriptions/checkout', body)
}
