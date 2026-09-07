<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useContentDetail } from '../queries'
import { ROUTE_NAMES } from '@/router/route-names'
import { Skeleton } from '@/components/ui/skeleton'
import Badge from '@/components/ui/badge/Badge.vue'
import { ArrowLeft, Bookmark, Lock, XCircle } from '@lucide/vue'
import { formatDate } from '@/lib/dates'
import Separator from '@/components/ui/separator/Separator.vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const route = useRoute()
const tenantStore = useTenantStore()

const contentId = computed(() => {
  const raw = route.params.contentId
  return Array.isArray(raw) ? (raw[0] ?? '') : raw
})

const { data: content, isPending, isError, error } = useContentDetail(contentId)

const isProtectedByTier = computed(() => error.value?.code === 'INSUFFICIENT_TIER')
const isNotFound = computed(() => error.value?.code === 'NOT_FOUND')
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <RouterLink
      :to="{ name: ROUTE_NAMES.tenantCatalog, params: { tenantSlug: tenantStore.slug } }"
      class="text-neutral-600 inline-flex items-center gap-2"
    >
      <ArrowLeft class="size-4" />
      Retour au catalog
    </RouterLink>

    <div v-if="isPending" class="mt-6 space-y-4">
      <Skeleton class="h-4" />
      <Skeleton class="h-4" />
      <Skeleton class="h-4" />
      <Skeleton class="h-4" />
    </div>

    <Card v-else-if="isProtectedByTier" class="mt-6">
      <CardHeader>
        <h1 class="text-xl font-semibold inline-flex items-center gap-2">
          <Lock class="size-4" />
          Ce contenu est reservé aux abonnés Premium
        </h1>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Votre offre actuelle ne couvre pas cette publication. Passez à une offre Premium pour la
          débloquer, ainsi que tout le catalog premium.
        </CardDescription>

        <CardFooter class="mt-4 px-0">
          <RouterLink
            :to="{ name: ROUTE_NAMES.tenantPlans, params: { tenantSlug: tenantStore.slug } }"
            custom
            v-slot="{ navigate }"
          >
            <Button type="button" variant="default" @click="navigate"> Voir les offres </Button>
          </RouterLink>
        </CardFooter>
      </CardContent>
    </Card>

    <Alert v-else-if="isNotFound" class="mt-6" variant="destructive">
      <XCircle />
      <AlertTitle>Publication introuvable</AlertTitle>
      <AlertDescription> Le contenu n'existe pas ou n'est plus disponible</AlertDescription>
    </Alert>

    <Alert v-else-if="isError" class="mt-6" variant="destructive">
      <XCircle />
      <AlertTitle>
        Impossible de charger cette publication pour le moment. Veullez réssayer plus tard
      </AlertTitle>
    </Alert>

    <div v-else-if="content" class="mt-6 flex flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <Badge variant="default">{{ content.category }}</Badge>
        <Badge :variant="content.tier === 'FREE' ? 'free' : 'default'">{{ content.tier }}</Badge>
      </div>

      <h1 class="text-4xl font-semibold">{{ content.title }}</h1>
      <div class="flex justify-between items-center gap-4">
        <span class="text-neutral-600 text-sm">
          Publié le <span class="font-bold">{{ formatDate(content.publishedAt) }}</span>
        </span>

        <Button class="flex gap-2 items-center" size="sm" variant="ghost" type="button">
          <Bookmark />
          Ajouter aux favoris
        </Button>
      </div>

      <Separator />

      <div class="mt-6 flex flex-col gap-4">
        <span class="text-2xl font-semibold">Résumé </span>
        <span>{{ content.excerpt }}</span>
      </div>

      <Separator />

      <div class="mt-6 flex flex-col gap-4">
        <span class="text-2xl font-semibold">Contenu </span>
        <span>{{ content.body }}</span>
      </div>
    </div>
  </div>
</template>
