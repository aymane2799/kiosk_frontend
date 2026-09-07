<script setup lang="ts">
import { useTenantConfig } from '@/features/tenant/queries'
import { resolveTenant } from '@/features/tenant/resolvers'
import { tenantThemeVariables } from '@/features/tenant/theme'
import { useTenantStore } from '@/stores/tenant'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tenantStore = useTenantStore()

const slug = computed(() => resolveTenant(route))
const { data: config, isPending, isError, error } = useTenantConfig(slug)

watch(slug, (newSlug) => tenantStore.setSlug(newSlug), { immediate: true })
watch(
  config,
  (newConfig) => {
    if (newConfig) {
      tenantStore.setConfig(newConfig)
    }
  },
  { immediate: true },
)

const themeVariables = computed(() => tenantThemeVariables(tenantStore.config))
</script>

<template>
  <div :style="themeVariables" class="flex min-h-screen flex-col">
    <header class="flex justify-between bg-brand-primary border-b border-brand-primary">
      <div class="container mx-auto flex items-center gap-8 px-6 py-3">
        <div class="flex items-center gap-4">
          <template v-if="tenantStore.isTenantResolved">
            <img
              v-if="tenantStore.logoUrl"
              :src="tenantStore.logoUrl"
              :alt="tenantStore.name ?? 'Tenant Logo'"
              class="h-8 w-auto object-contain"
            />
            <span class="text-md font-semibold text-neutral-300"> | KioskBridge </span>
          </template>

          <!-- show navigation when user is authenticated -->
          <nav v-if="false" class="flex gap-4 items-center ml-4">
            <RouterLink to="">Acceuil</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="container mx-auto flex-1 px-6 py-8">
      <div v-if="isError" class="mx-auto max-w-md py-16 text-center">
        <h1 class="text-lg font-semibold">Partenaire introuvable</h1>
        <p class="mt-2 text-sm text-neutral-500">
          Aucun partenaire ne correspond à {{ slug }}. Vérifiez le lien.
        </p>
      </div>

      <RouterView />
    </main>

    <footer class="border-t border-brand-primary">
      <div class="container mx-auto px-6 py-4 text-xs text-neutral-500">
        @ Copyright KioskBridge
      </div>
    </footer>
  </div>
</template>
