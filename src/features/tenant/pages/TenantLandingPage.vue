<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
</script>

<template>
  <div class="flex flex-col gap-4 py-8">
    <p class="text-brand-primary">{{ tenantStore.name }}</p>
    <h1 class="text-4xl font-semibold max-w-md mt-3">
      Toute la presse que vous cherchez en un seul endroit
    </h1>
    <p class="mt-4">
      Connectez-vous avec votre compte {{ tenantStore.name }} pour retrouver le catalogue partagé et
      vos favoris.
    </p>

    <div class="mt-8">
      <RouterLink :to="{ name: 'tenant-login' }">
        <Button> Se connecter </Button>
      </RouterLink>
    </div>
  </div>
</template>
