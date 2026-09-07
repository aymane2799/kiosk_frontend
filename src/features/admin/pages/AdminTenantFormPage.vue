<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetTenant } from '../queries'
import { useCreateTenant, useUpdateTenant } from '../mutations'
import { FALLBACK_PRIMARY, FALLBACK_SECONDARY } from '@/features/tenant/theme'
import type { AdminTenantRequest } from '../types'
import { ROUTE_NAMES } from '@/router/route-names'
import { ArrowLeft, XCircle } from '@lucide/vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const tenantId = computed(() =>
  typeof route.params.tenantId === 'string' ? route.params.tenantId : null,
)

const isEdit = computed(() => tenantId.value !== null)

const { data: tenant, isPending, error } = useGetTenant(tenantId)

const create = useCreateTenant()
const update = useUpdateTenant()

const form = reactive({
  name: '',
  slug: '',
  logoUrl: '',
  primaryColor: '',
  secondaryColor: '',
  providerId: '',
})

watch(tenant, (next) => {
  if (!next) return

  form.name = next.name
  form.slug = next.slug
  form.logoUrl = next.logoUrl
  form.primaryColor = next.primaryColor ?? FALLBACK_PRIMARY
  form.secondaryColor = next.secondaryColor ?? FALLBACK_SECONDARY
  form.providerId = next.providerId ?? ''
})

const mutation = computed(() => (isEdit.value ? update : create))
const isSaving = computed(() => mutation.value.isPending.value)
const isNotFound = computed(() => isEdit.value && error.value?.code === 'NOT_FOUND')

const fieldErrors = computed<Record<string, string>>(() =>
  Object.fromEntries(
    (mutation.value.error.value?.errors ?? []).map((err) => [err.field, err.message]),
  ),
)

const formError = computed(() => {
  const error = mutation.value.error.value
  if (!error) return null
  switch (error.code) {
    case 'CONFLICT':
      return 'ce slug ou ce nom est déjà utilisé par un autre partenaire'
    case 'VALIDATION_ERROR':
      return null
    case 'NOT_FOUND':
      return "Ce partenaire n'existe pas"
    case 'NETWORK_ERROR':
      return 'Serveur injoignable. Réssayer dans un instant'

    default:
      return 'Enregistrement impossible pour le moment'
  }
})

function trimmedOrNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function submit() {
  if (isSaving.value) return

  const body: AdminTenantRequest = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    logoUrl: form.logoUrl.trim(),
    primaryColor: trimmedOrNull(form.primaryColor),
    secondaryColor: trimmedOrNull(form.secondaryColor),
    providerId: trimmedOrNull(form.providerId),
  }

  const onSuccess = () => router.push({ name: ROUTE_NAMES.adminTenants })

  if (isEdit.value && tenantId.value) {
    update.mutate({ id: tenantId.value, body }, { onSuccess })
  } else {
    create.mutate(body, { onSuccess })
  }
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-4">
      <RouterLink
        :to="{ name: ROUTE_NAMES.adminTenants }"
        class="text-neutral-600 inline-flex items-center gap-2"
      >
        <ArrowLeft class="size-4" />
        Retour
      </RouterLink>

      <h1 class="text-4xl font-semibold">
        {{ isEdit ? 'Modifier le partenaire' : 'Nouveau partenaire' }}
      </h1>
    </header>

    <Alert v-if="isNotFound" class="" variant="destructive">
      <XCircle />
      <AlertTitle>Partenaire introuvable</AlertTitle>
      <AlertDescription>
        Le partenaire que vous essayez de modifier n'existe pas ou n'est plus
        disponible</AlertDescription
      >
    </Alert>

    <Card v-else class="max-w-xl">
      <CardContent>
        <form @submit.prevent="submit">
          <FieldGroup>
            <FieldGroup class="grid xl:grid-cols-2">
              <Field>
                <FieldLabel for="name"> Nom </FieldLabel>
                <Input id="name" v-model="form.name" placeholder="Le matin" required />
              </Field>
              <Field>
                <div class="flex items-center">
                  <FieldLabel for="slug"> Slug </FieldLabel>
                </div>
                <Input id="slug" v-model="form.slug" required placeholder="le-matin" />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel for="logoUrl"> Logo </FieldLabel>
                <Input
                  id="logoUrl"
                  v-model="form.logoUrl"
                  placeholder="https://placehold.co/600x400"
                  required
                />
              </Field>
            </FieldGroup>
            <FieldGroup class="grid xl:grid-cols-2">
              <Field>
                <FieldLabel for="primaryColor"> Couleur principale </FieldLabel>
                <div class="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    v-model="form.primaryColor"
                    :placeholder="FALLBACK_PRIMARY"
                    class="w-14"
                  />
                  <Input
                    id="primaryColor"
                    v-model="form.primaryColor"
                    :placeholder="FALLBACK_PRIMARY"
                    class="flex-1"
                  />
                </div>
              </Field>
              <Field>
                <div class="flex items-center">
                  <FieldLabel for="secondaryColor"> Couleur secondaire </FieldLabel>
                </div>
                <div class="flex items-center gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    v-model="form.secondaryColor"
                    :placeholder="FALLBACK_SECONDARY"
                    class="w-14"
                  />
                  <Input
                    id="secondaryColor"
                    v-model="form.secondaryColor"
                    :placeholder="FALLBACK_SECONDARY"
                    class="flex-1"
                  />
                </div>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel for="providerId"> Provider </FieldLabel>
                <Input id="providerId" v-model="form.providerId" placeholder="le-matin-oauth" />
              </Field>
            </FieldGroup>

            <Field>
              <Button type="submit"> Confirmer </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </section>
</template>
