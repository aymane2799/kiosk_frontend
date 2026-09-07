import type { DataTableFeatures } from '@/components/ui/data-table/features'
import { createColumnHelper } from '@tanstack/vue-table'
import type { PlanResponse } from '../../types'
import { Badge } from '@/components/ui/badge'
import { formatBillingPeriod, formatPrice } from '@/lib/format'

const helper = createColumnHelper<DataTableFeatures, PlanResponse>()

export const plansColumns = helper.columns([
  helper.accessor('name', {
    header: 'Nom',
    cell(props) {
      return <span class="font-medium">{props.getValue()}</span>
    },
  }),
  helper.accessor('tier', {
    header: 'Palier',
    cell(props) {
      const tier = props.getValue()
      return <Badge variant={tier === 'FREE' ? 'free' : 'default'}>{tier}</Badge>
    },
  }),
  helper.accessor('price', {
    header: 'Prix',
    cell({ row }) {
      const { price, currency } = row.original
      return <span>{formatPrice(price, currency)}</span>
    },
  }),
  helper.accessor('billingPeriod', {
    header: 'Facturation',
    cell(props) {
      return <span>{formatBillingPeriod(props.getValue())}</span>
    },
  }),
])
