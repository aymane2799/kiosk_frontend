import type { DataTableFeatures } from '@/components/ui/data-table/features'
import { createColumnHelper } from '@tanstack/vue-table'
import type { AdminTenantResponse } from '../../types'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'

const helper = createColumnHelper<DataTableFeatures, AdminTenantResponse>()

export const columns = helper.columns([
  helper.accessor('name', {
    header: 'Nom',
    cell({ row }) {
      const { name, logoUrl } = row.original

      return (
        <div class="flex flex-gap-2 items-center gap-2">
          <img src={logoUrl} alt="" class="h-8" />
          <span class="font-semibold">{name}</span>
        </div>
      )
    },
  }),
  helper.accessor('slug', {
    header: 'Slug',
  }),
  helper.accessor('providerId', {
    header: 'Provider',
  }),
  helper.accessor('primaryColor', {
    header: 'Couleur primaire',
    cell(props) {
      const value = props.getValue()
      return (
        <div class="flex items-center gap-2">
          <span class={'size-6 rounded'} style={{ backgroundColor: value ?? '' }}></span>
          {value}
        </div>
      )
    },
  }),
  helper.accessor('secondaryColor', {
    header: 'Couleur secondaire',
    cell(props) {
      const value = props.getValue()
      return (
        <div class="flex items-center gap-2">
          <span class={'size-6 rounded'} style={{ backgroundColor: value ?? '' }}></span>
          {value}
        </div>
      )
    },
  }),
  helper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tenantId = row.original.id
      return (
        <div class="flex gap-4">
          <RouterLink to={{ name: ROUTE_NAMES.adminTenantDetail, params: { tenantId } }}>
            <Eye class="size-4" />
          </RouterLink>
          <RouterLink to={{ name: ROUTE_NAMES.adminUpdateTenant, params: { tenantId } }}>
            <Edit class="size-4" />
          </RouterLink>
        </div>
      )
    },
  }),
])
