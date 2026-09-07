import { FALLBACK_PRIMARY, FALLBACK_SECONDARY } from '@/features/tenant/theme'
import type { TenantPublicResponse } from '@/features/tenant/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTenantStore = defineStore('tenant', () => {
  const slug = ref<string | null>(null)
  const config = ref<TenantPublicResponse | null>(null)

  const isTenantResolved = computed(() => config.value !== null)
  const name = computed(() => config.value?.name ?? null)
  const logoUrl = computed(() => config.value?.logoUrl ?? null)
  const primaryColor = computed(() => config.value?.primaryColor ?? FALLBACK_PRIMARY)
  const secondaryColor = computed(() => config.value?.secondaryColor ?? FALLBACK_SECONDARY)
  const providerId = computed(() => config.value?.providerId ?? null)

  function setSlug(newSlug: string | null) {
    slug.value = newSlug
    if (newSlug == null || newSlug !== config.value?.slug) config.value = null
  }

  function setConfig(newConfig: TenantPublicResponse) {
    slug.value = newConfig.slug
    config.value = newConfig
  }

  function clear() {
    slug.value = null
    config.value = null
  }

  return {
    slug,
    config,
    isTenantResolved,
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    providerId,
    setSlug,
    setConfig,
    clear,
  }
})
