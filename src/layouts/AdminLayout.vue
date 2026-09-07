<script setup lang="ts">
import Logo from '@/components/Logo.vue'
import { Button } from '@/components/ui/button'

const navLinks = [{ label: 'Tenants', to: { name: 'admin-tenants' } }]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="h-16 flex justify-between bg-primary">
      <div class="container mx-auto flex items-center justify-between gap-8 px-6 py-3">
        <Logo />

        <nav class="flex gap-4 items-center">
          <!-- TODO: show navigation when user is authenticated -->
          <template v-if="false">
            <RouterLink
              v-for="(item, index) in navLinks"
              :key="index"
              :to="item.to"
              class="text-white text-semibold"
            >
              {{ item.label }}
            </RouterLink>
          </template>
          <template v-else>
            <Button variant="secondary">Se connecter</Button>
          </template>
        </nav>
      </div>
    </header>

    <main class="container mx-auto flex-1 px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
