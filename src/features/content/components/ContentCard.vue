<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { type ContentSummaryResponse } from '@/features/content/types'
import FavoriteButton from '@/features/favorite/components/FavoriteButton.vue'
import { formatDate } from '@/lib/format'
import { ROUTE_NAMES } from '@/router/route-names'
import { useTenantStore } from '@/stores/tenant'
import { Lock } from '@lucide/vue'

defineProps<{ content: ContentSummaryResponse }>()

const tenantStore = useTenantStore()
</script>

<template>
  <component
    :is="content.locked ? 'div' : 'router-link'"
    :to="{
      name: ROUTE_NAMES.tenentContentDetail,
      params: { tenantSlug: tenantStore.slug, contentId: content.id },
    }"
  >
    <Item variant="outline" role="listitem" class="h-full bg-white">
      <ItemHeader>
        <Badge :variant="content.tier === 'FREE' ? 'free' : 'default'">{{ content.tier }}</Badge>

        <Badge v-if="content.locked" variant="outline" class="h-full flex items-center gap-2">
          <Lock /> Verrouillé
        </Badge>
      </ItemHeader>

      <ItemContent class="flex flex-col items-start">
        <div class="flex items-center justify-between gap-4"></div>

        <ItemTitle>{{ content.title }}</ItemTitle>
        <ItemDescription>{{ content.excerpt }}</ItemDescription>
      </ItemContent>

      <ItemFooter>
        <span class="text-sm text-neutral-500">{{ formatDate(content.publishedAt) }}</span>
        <FavoriteButton v-if="!content.locked" :content="content" :with-label="false" />
      </ItemFooter>
    </Item>
  </component>
</template>
