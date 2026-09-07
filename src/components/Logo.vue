<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'dark' | 'light'
}

withDefaults(defineProps<Props>(), {
  variant: 'dark',
})
</script>

<template>
  <span
    :class="
      cn('inline-flex font-semibold select-none', {
        'text-black': variant === 'light',
        'text-white': variant === 'dark',
      })
    "
  >
    Kiosk Bridge
  </span>
</template>
