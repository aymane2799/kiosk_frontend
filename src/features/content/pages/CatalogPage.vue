<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { useCatalog } from '../queries'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty/index.ts'
import { List, XCircle } from '@lucide/vue'
import ContentCard from '../components/ContentCard.vue'
import { ItemGroup } from '@/components/ui/item'
import { Alert, AlertTitle } from '@/components/ui/alert/index.ts'

const { data, isPending, isError } = useCatalog()
</script>

<template>
  <section>
    <header>
      <h1 class="text-4xl font-semibold">Catalog</h1>
    </header>

    <div v-if="isPending" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton class="min-h-40" v-for="n in 10" :key="n" />
    </div>

    <Alert v-else-if="isError" class="mt-6" variant="destructive">
      <XCircle />
      <AlertTitle>
        Impossible de charger le catalog pour le moment. Veuillez réssayer plus tard
      </AlertTitle>
    </Alert>

    <Empty v-else-if="!data || data?.length === 0" class="mt-6 h-full bg-white shadow-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <List />
        </EmptyMedia>
        <EmptyTitle>Catalog vide</EmptyTitle>
        <EmptyDescription> Aucune publication n'est disponible pour le moment </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <ItemGroup v-else class="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ContentCard v-for="(item, index) in data" :key="item.id" :content="item" />
    </ItemGroup>
  </section>
</template>
