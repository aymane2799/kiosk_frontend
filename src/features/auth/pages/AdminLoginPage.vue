<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'
import { useAdminLogin } from '@/features/auth/auth-mutations'

const route = useRoute()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const login = useAdminLogin()

function submit() {
  if (login.isPending.value) return

  login.mutate(
    { email: form.email, password: form.password },
    {
      onSuccess: () => {
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null

        router.push(redirect ?? { name: ROUTE_NAMES.adminTenants })
      },
    },
  )
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6')">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-lg"> Bienvenue à nouveau </CardTitle>
        <CardDescription class="text-sm text-neutral-500"> Réservé aux admins </CardDescription>
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
              <div class="flex items-center">
                <FieldLabel for="password"> Mot de passe </FieldLabel>
              </div>
              <Input id="password" type="password" v-model="form.password" required />
            </Field>
            <Field>
              <Button type="submit"> Se Connecter </Button>
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
