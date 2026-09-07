<script setup lang="ts">
import type { ContentDetailResponse, ContentSummaryResponse } from '@/features/content/types'
import { useAddFavorite, useremoveFavorite } from '../mutations'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Bookmark } from '@lucide/vue'
import { cn } from '@/lib/utils'

interface Props {
  content:
    Pick<ContentSummaryResponse, 'id' | 'favorite'> | Pick<ContentDetailResponse, 'id' | 'favorite'>
  withLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  withLabel: true,
})

const add = useAddFavorite()
const remove = useremoveFavorite()

const isLoading = computed(() => add.isPending.value || remove.isPending.value)
const label = computed(() =>
  props.content.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris',
)

function toggle() {
  if (isLoading.value) return
  else if (props.content.favorite) remove.mutate(props.content.id)
  else add.mutate({ contentId: props.content.id })
}
</script>

<template>
  <Button
    class="flex gap-2 items-center"
    type="button"
    size="sm"
    :title="label"
    :variant="props.content.favorite ? 'default' : 'ghost'"
    :disabled="isLoading"
    @click.prevent="toggle"
  >
    <Bookmark :class="cn({ 'fill-current': props.content.favorite })" />
    <span v-if="props.withLabel">
      {{ label }}
    </span>
  </Button>
</template>
