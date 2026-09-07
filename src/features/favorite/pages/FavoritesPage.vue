<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { computed } from 'vue'
import { useGetFavorites } from '../queries'
import { ROUTE_NAMES } from '@/router/route-names'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Star, XCircle } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ItemGroup } from '@/components/ui/item'
import ContentCard from '@/features/content/components/ContentCard.vue'

const tenantStore = useTenantStore()

const { data: favorites, isPending, isError } = useGetFavorites()
</script>

<template>
  <section>
    <header>
      <h1 class="text-4xl font-semibold">Favoris</h1>
    </header>

    <div v-if="isPending" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton class="min-h-40" v-for="n in 10" :key="n" />
    </div>

    <Alert v-else-if="isError" class="mt-6" variant="destructive">
      <XCircle />
      <AlertTitle>
        Impossible de charger vos favoris pour le moment. Veuillez réssayer plus tard
      </AlertTitle>
    </Alert>

    <Empty v-else-if="!favorites || favorites?.length === 0" class="mt-6 h-full bg-white shadow-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Star />
        </EmptyMedia>
        <EmptyTitle>Liste des favoris vide</EmptyTitle>
        <EmptyDescription>
          <RouterLink
            :to="{ name: ROUTE_NAMES.tenantCatalog, params: { tenantSlug: tenantStore.slug } }"
            custom
            v-slot="{ navigate }"
          >
            <Button size="sm" @click="navigate"> Parcourir le catalog</Button>
          </RouterLink>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <ItemGroup v-else class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ContentCard v-for="(item, index) in favorites" :key="item.id" :content="item" />
    </ItemGroup>
  </section>
</template>
