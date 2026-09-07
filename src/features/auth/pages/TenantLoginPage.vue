<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'
import { useTenantLogin } from '@/features/auth/auth-mutations'
import { useTenantStore } from '@/stores/tenant'

const route = useRoute()
const router = useRouter()

const tenantStore = useTenantStore()

const form = reactive({
  email: '',
  externalId: '',
  firstName: '',
  lastName: '',
})

const { slug } = useTenantStore()

const login = useTenantLogin()

function submit() {
  if (login.isPending.value || !slug) return

  login.mutate(
    {
      tenantSlug: slug!,
      account: {
        email: form.email,
        externalId: form.externalId,
        firstName: form.firstName,
        lastName: form.lastName,
      },
    },
    {
      onSuccess: () => {
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
        router.push(redirect ?? { name: ROUTE_NAMES.tenantHome, params: { tenantSlug: slug } })
      },
    },
  )
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6')">
    <div class="flex items-center justify-center gap-2">
      <template v-if="tenantStore.isTenantResolved">
        <RouterLink :to="{ name: ROUTE_NAMES.tenantHome }">
          <img
            v-if="tenantStore.logoUrl"
            :src="tenantStore.logoUrl"
            :alt="tenantStore.name ?? 'Tenant Logo'"
            class="h-8 w-auto object-contain"
          />
        </RouterLink>
      </template>
    </div>
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-lg"> Bienvenue à nouveau </CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submit">
          <FieldGroup>
            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel for="externalId"> Identifiant externe </FieldLabel>
              <Input id="externalId" v-model="form.externalId" placeholder="test-1" required />
            </Field>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel for="lastName"> Nom </FieldLabel>
                <Input id="lastName" v-model="form.lastName" placeholder="Sparrow" required />
              </Field>
              <Field>
                <FieldLabel for="firstName"> Prénom </FieldLabel>
                <Input id="firstName" v-model="form.firstName" placeholder="Jack" required />
              </Field>
            </div>

            <Field>
              <Button type="submit"> Se Connecter </Button>
              <RouterLink custom v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.tenantHome }">
                <Button type="button" @click="navigate" variant="link"> Retour </Button>
              </RouterLink>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      En cliquant sur « Se Connecter », vous acceptez nos
      <a href="#">Conditions générales d'utilisation</a> et notre
      <a href="#">Politique de confidentialité</a>.
    </FieldDescription>
  </div>
</template>
