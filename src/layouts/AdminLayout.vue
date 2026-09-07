<script setup lang="ts">
import Logo from '@/components/Logo.vue'
import { Button } from '@/components/ui/button'
import { ROUTE_NAMES } from '@/router/route-names'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const navLinks = [{ label: 'Tenants', to: { name: ROUTE_NAMES.adminTenants } }]

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.clear('admin')
  void router.push({ name: ROUTE_NAMES.adminLogin })
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="h-16 flex justify-between bg-primary">
      <div class="container mx-auto flex items-center justify-between gap-8 px-6 py-3">
        <Logo />

        <nav class="flex gap-4 items-center">
          <!-- TODO: show navigation when user is authenticated -->
          <template v-if="auth.isAdminAuthenticated">
            <RouterLink
              v-for="(item, index) in navLinks"
              :key="index"
              :to="item.to"
              class="text-white text-semibold"
            >
              {{ item.label }}
            </RouterLink>
            <Button @click="logout" role="button" variant="destructive" size="sm">
              Se déconnecter
            </Button>
          </template>
          <template v-else>
            <RouterLink custom v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.adminLogin }">
              <Button @click="navigate" role="link" variant="secondary" size="sm">
                Se connecter
              </Button>
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="container mx-auto flex-1 px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
