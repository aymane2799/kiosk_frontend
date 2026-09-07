<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { useMySubscription, usePlans } from '../queries'
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useCheckout } from '../mutations'
import type { SubscriptionStatus } from '@/shared/types'
import { useQueryClient } from '@tanstack/vue-query'
import { contentKeys } from '@/features/content/query-keys'
import { ROUTE_NAMES } from '@/router/route-names'
import { AlertCircle, AlertTriangle, CheckCircle, PlayingCardsFan } from '@lucide/vue'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import PlanCard from '../components/PlanCard.vue'
import { Spinner } from '@/components/ui/spinner/index.ts'
import { formatDate } from '@/lib/format.ts'

const authStore = useAuthStore()
const tenantStore = useTenantStore()

const queryClient = useQueryClient()

const isAuthenticated = computed(
  () => authStore.isUserAuthenticated && authStore.tenantSlug === tenantStore.slug,
)
const { data: plans, isPending: isPlansPending, isError: isPlansError } = usePlans(tenantStore.slug)
const { data: mySubscription } = useMySubscription(isAuthenticated)

const checkout = useCheckout()

const simulateFailure = ref(false)
const pendingPlanId: Ref<string | null> = ref(null)

const status: ComputedRef<SubscriptionStatus | null> = computed(
  () => mySubscription.value?.status ?? null,
)
const isProcessing = computed(() => checkout.isPending.value || status.value === 'PENDING')

function isCurrentPLan(planId: string) {
  return mySubscription.value?.planId === planId
}

function subscribe(planId: string) {
  console.log(isProcessing.value)
  if (isProcessing.value) return
  pendingPlanId.value = planId
  checkout.mutate({ planId, simulateFailure: simulateFailure.value })
}

watch(status, (next) => {
  if (next === 'ACTIVE') void queryClient.invalidateQueries({ queryKey: contentKeys.all })
  if (next !== 'PENDING') pendingPlanId.value = null
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-2">
      <h1 class="text-4xl text-semibold mt-6">Offres</h1>
      <p class="text-neutral-500 text-sm">
        Des offres premium pour débloquer l'ensemble du catalogue
      </p>
    </header>

    <!-- Current Subscription -->
    <div v-if="isAuthenticated && mySubscription" class="mt-6">
      <Alert v-if="status === 'PENDING'">
        <Spinner />
        <AlertTitle> Paiement en cours de traitement... </AlertTitle>
      </Alert>

      <Alert v-if="status === 'ACTIVE'" variant="success">
        <CheckCircle />
        <AlertTitle>
          Abonnement <strong>{{ mySubscription.planName }}</strong> actif. Renouvelemnt le
          <strong>{{ formatDate(mySubscription.expiresAt) }}</strong>
        </AlertTitle>
      </Alert>

      <Alert v-if="status === 'FAILED'" variant="destructive">
        <AlertCircle />
        <AlertTitle>
          Le paiement a échoué - aucun accès n'a été débité. Vous pouvez réssayer.
        </AlertTitle>
      </Alert>
    </div>

    <!-- Guest Visitor -->
    <Alert v-if="!isAuthenticated">
      <AlertTitle>
        <RouterLink
          :to="{ name: ROUTE_NAMES.tenantLogin, params: { tenantSlug: tenantStore.slug } }"
          class="text-primary"
        >
          Connectez-vous
        </RouterLink>
        pour vous souscrire à une offre.
      </AlertTitle>
    </Alert>

    <!-- Plans bloc -->
    <div v-if="isPlansPending" class="max-2xl-md mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Skeleton v-for="n in 3" :key="n" class="h-64 min-w-64" />
    </div>

    <Alert v-else-if="isPlansError" variant="destructive">
      <AlertTriangle class="size-4" />
      <AlertTitle>
        Impossible de charger les offres pour le moment. Veuillez réssayer plus tard
      </AlertTitle>
    </Alert>

    <Empty v-else-if="!plans || plans?.length === 0" class="h-full bg-white shadow-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PlayingCardsFan />
        </EmptyMedia>
        <EmptyTitle class="text-xl font-semibold">Offres vide</EmptyTitle>
        <EmptyDescription> Aucune offre n'est disponible pour le moment </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <ItemGroup v-else class="max-2xl-md mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :isCurrentPlan="isCurrentPLan(plan.id)"
        :isCheckoutDisabled="isProcessing || (isCurrentPLan(plan.id) && status === 'ACTIVE')"
        :isCheckoutProcessing="isProcessing"
        :pendingPlanId="pendingPlanId"
        :status="status"
        @subscribe="subscribe"
      />
    </ItemGroup>

    <Alert v-if="checkout.isError.value" variant="destructive">
      <AlertTitle> La souscriptions n'a pas pu être lancé. Réssayez dans un instant </AlertTitle>
    </Alert>
  </div>
</template>
