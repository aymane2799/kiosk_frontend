<script setup lang="ts">
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { PlanResponse } from '../types'
import { Badge } from '@/components/ui/badge'
import { formatBillingPeriod, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { computed } from 'vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import type { SubscriptionStatus } from '@/shared/types'

interface Props {
  plan: PlanResponse
  isCurrentPlan: boolean
  isCheckoutDisabled: boolean
  isCheckoutProcessing: boolean
  pendingPlanId: string | null
  status: SubscriptionStatus | null
}

interface Emits {
  subscribe: [planId: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const tenantStore = useTenantStore()

const isAuthenticated = computed(
  () => authStore.isUserAuthenticated && authStore.tenantSlug === tenantStore.slug,
)
</script>

<template>
  <Item
    role="listitem"
    :class="
      cn('h-full w-80 max-w-md gap-y-16 px-8 bg-white', {
        'border-2 border-neutral-200': plan.tier === 'FREE',
        'border-2 border-primary': plan.tier === 'PREMIUM',
      })
    "
  >
    <ItemHeader>
      <ItemTitle class="text-2xl font-semibold">{{ plan.name }}</ItemTitle>
      <Badge :variant="plan.tier === 'FREE' ? 'free' : 'default'">{{ plan.tier }}</Badge>
    </ItemHeader>

    <ItemContent class="flex flex-col items-start gap-8">
      <ItemDescription class="text-xs text-neutral-500">
        Débloque les contenus {{ plan.tier === 'PREMIUM' ? 'Premium' : 'gratuits' }}
      </ItemDescription>

      <span class="text-3xl font-bold">
        {{ formatPrice(plan.price, plan.currency) }}
        <span class="text-xl">
          {{ formatBillingPeriod(plan.billingPeriod) }}
        </span>
      </span>
    </ItemContent>

    <ItemFooter class="justify-center">
      <Button
        v-if="isAuthenticated"
        class="flex items-center gap-2 w-full"
        :disabled="isCheckoutDisabled"
        @click="() => emit('subscribe', plan.id)"
      >
        <template v-if="pendingPlanId === plan.id && isCheckoutProcessing">
          <Spinner />
          Traitement…
        </template>
        <template v-else-if="isCurrentPlan && status === 'ACTIVE'">Offre actuelle</template>
        <template v-else-if="isCurrentPlan && status === 'FAILED'">Réessayer</template>
        <template v-else>S'abonner</template>
      </Button>
    </ItemFooter>
  </Item>
</template>
