<script setup lang="ts">
import { Alert, AlertTitle } from '@/components/ui/alert'
import { useGetTenants } from '../../queries'
import { List, XCircle } from '@lucide/vue'
import { ROUTE_NAMES } from '@/router/route-names'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/ui/data-table/DataTable.vue'
import { columns } from './columns'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const { data: tenants, isPending, isError } = useGetTenants()
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex justify-between gap-4">
      <h1 class="text-4xl font-semibold">Partenaires</h1>

      <RouterLink :to="{ name: ROUTE_NAMES.adminCreateTenant }" custom v-slot="{ navigate }">
        <Button @click="navigate">Créer un partenaire</Button>
      </RouterLink>
    </header>

    <div v-if="isPending"></div>

    <Alert v-if="isError" variant="destructive">
      <XCircle />
      <AlertTitle>
        Impossible de charger la liste des partenaires pour le moment. Veuillez réssayer plus tard
      </AlertTitle>
    </Alert>

    <Empty v-else-if="!tenants || tenants?.length === 0" class="h-full bg-white shadow-sm">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <List />
        </EmptyMedia>
        <EmptyTitle>Liste des partenaires vide</EmptyTitle>
        <EmptyDescription> Aucun partenaire n'est enregistré pour le moment </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <DataTable v-else :data="tenants" :columns="columns" />
  </section>
</template>
