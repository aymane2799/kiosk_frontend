<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetTenant, useGetTenantPlans, useGetTenantUsers } from '../../queries'
import { ROUTE_NAMES } from '@/router/route-names'
import { ArrowLeft, CreditCard, Pen, Users, XCircle } from '@lucide/vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import DataTable from '@/components/ui/data-table/DataTable.vue'
import { formatDate } from '@/lib/format'
import { usersColumns } from './users-columns'
import { plansColumns } from './plans-columns'

const route = useRoute()

const tenantId = computed(() =>
  typeof route.params.tenantId === 'string' ? route.params.tenantId : null,
)

const { data: tenant, isPending, error } = useGetTenant(tenantId)
const {
  data: users,
  isPending: isUsersPending,
  isError: isUsersError,
} = useGetTenantUsers(tenantId)
const {
  data: plans,
  isPending: isPlansPending,
  isError: isPlansError,
} = useGetTenantPlans(tenantId)

const isNotFound = computed(() => error.value?.code === 'NOT_FOUND')
</script>

<template>
  <section class="flex flex-col gap-8">
    <header class="flex flex-col gap-4">
      <RouterLink
        :to="{ name: ROUTE_NAMES.adminTenants }"
        class="text-neutral-600 inline-flex items-center gap-2"
      >
        <ArrowLeft class="size-4" />
        Retour
      </RouterLink>

      <div class="flex items-start justify-between gap-4">
        <h1 class="text-4xl font-semibold">
          {{ tenant?.name ?? 'Partenaire' }}
        </h1>

        <RouterLink
          v-if="tenant"
          :to="{ name: ROUTE_NAMES.adminUpdateTenant, params: { tenantId } }"
          custom
          v-slot="{ navigate }"
        >
          <Button variant="outline" @click="navigate">
            <Pen class="size-4" />
            Modifier
          </Button>
        </RouterLink>
      </div>
    </header>

    <Alert v-if="isNotFound" variant="destructive">
      <XCircle />
      <AlertTitle>Partenaire introuvable</AlertTitle>
      <AlertDescription>
        Le partenaire que vous cherchez n'existe pas ou n'est plus disponible.
      </AlertDescription>
    </Alert>

    <Alert v-else-if="error" variant="destructive">
      <XCircle />
      <AlertTitle>
        Impossible de charger le partenaire pour le moment. Veuillez réssayer plus tard.
      </AlertTitle>
    </Alert>

    <template v-else>
      <Skeleton v-if="isPending" class="h-40 w-full max-w-xl" />

      <Card v-else-if="tenant" class="max-w-xl">
        <CardContent class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <img :src="tenant.logoUrl" alt="" class="h-12" />
            <div class="flex flex-col">
              <span class="text-lg font-semibold">{{ tenant.name }}</span>
              <span class="text-sm text-neutral-500">{{ tenant.slug }}</span>
            </div>
          </div>

          <dl class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex flex-col gap-1">
              <dt class="text-neutral-500">Provider</dt>
              <dd>{{ tenant.providerId ?? '—' }}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-neutral-500">Créé le</dt>
              <dd>{{ formatDate(tenant.createdAt) ?? '—' }}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-neutral-500">Couleur primaire</dt>
              <dd class="flex items-center gap-2">
                <span
                  class="size-5 rounded border"
                  :style="{ backgroundColor: tenant.primaryColor ?? '' }"
                />
                {{ tenant.primaryColor ?? '—' }}
              </dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-neutral-500">Couleur secondaire</dt>
              <dd class="flex items-center gap-2">
                <span
                  class="size-5 rounded border"
                  :style="{ backgroundColor: tenant.secondaryColor ?? '' }"
                />
                {{ tenant.secondaryColor ?? '—' }}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <!-- Users -->
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">Utilisateurs</h2>

        <div v-if="isUsersPending" class="flex flex-col gap-2">
          <Skeleton v-for="n in 4" :key="n" class="h-12 w-full" />
        </div>

        <Alert v-else-if="isUsersError" variant="destructive">
          <XCircle />
          <AlertTitle>
            Impossible de charger les utilisateurs pour le moment. Veuillez réssayer plus tard.
          </AlertTitle>
        </Alert>

        <Empty v-else-if="!users || users.length === 0" class="bg-white shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>Aucun utilisateur</EmptyTitle>
            <EmptyDescription>
              Ce partenaire n'a aucun utilisateur enregistré pour le moment.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>

        <DataTable v-else :data="users" :columns="usersColumns" />
      </div>

      <!-- Plans -->
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">Offres</h2>

        <div v-if="isPlansPending" class="flex flex-col gap-2">
          <Skeleton v-for="n in 3" :key="n" class="h-12 w-full" />
        </div>

        <Alert v-else-if="isPlansError" variant="destructive">
          <XCircle />
          <AlertTitle>
            Impossible de charger les offres pour le moment. Veuillez réssayer plus tard.
          </AlertTitle>
        </Alert>

        <Empty v-else-if="!plans || plans.length === 0" class="bg-white shadow-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CreditCard />
            </EmptyMedia>
            <EmptyTitle>Aucune offre</EmptyTitle>
            <EmptyDescription>
              Ce partenaire n'a aucune offre enregistrée pour le moment.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>

        <DataTable v-else :data="plans" :columns="plansColumns" />
      </div>
    </template>
  </section>
</template>
