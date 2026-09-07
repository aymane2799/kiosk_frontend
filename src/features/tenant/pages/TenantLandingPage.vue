<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ROUTE_NAMES } from '@/router/route-names'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { computed } from 'vue'

const authStore = useAuthStore()
const tenantStore = useTenantStore()

const isAuthenticated = computed(
  () => authStore.isUserAuthenticated && authStore.tenantSlug === tenantStore.slug,
)
</script>

<template>
  <div class="flex flex-col gap-4 py-8">
    <p class="text-brand-primary">{{ tenantStore.name }}</p>
    <h1 class="text-4xl font-semibold max-w-md mt-3">
      Toute la presse que vous cherchez en un seul endroit
    </h1>
    <p class="mt-4" v-if="!isAuthenticated">
      Connectez-vous avec votre compte "{{ tenantStore.name }}" pour retrouver le catalogue partagé
      et vos favoris.
    </p>

    <div class="mt-8">
      <RouterLink
        v-if="!isAuthenticated"
        custom
        v-slot="{ navigate }"
        :to="{ name: ROUTE_NAMES.tenantLogin, params: { tenantId: tenantStore.slug ?? '' } }"
      >
        <Button @click="navigate" role="link"> Se connecter </Button>
      </RouterLink>

      <p v-else>Vous etes connecté</p>
    </div>
  </div>
</template>
