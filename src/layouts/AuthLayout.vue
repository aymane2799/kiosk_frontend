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
  <div
    :style="themeVariables"
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <RouterView />
    </div>
  </div>
</template>
