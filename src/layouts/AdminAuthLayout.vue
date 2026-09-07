<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<template>
  <div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex items-center justify-center gap-2">
        <Logo variant="light" />
      </div>
      <RouterView />
    </div>
  </div>
</template>
