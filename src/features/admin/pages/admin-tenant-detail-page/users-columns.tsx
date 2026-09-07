import type { DataTableFeatures } from '@/components/ui/data-table/features'
import { createColumnHelper } from '@tanstack/vue-table'
import type { AppUserResponse } from '../../types'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'

const helper = createColumnHelper<DataTableFeatures, AppUserResponse>()

export const usersColumns = helper.columns([
  helper.accessor('lastName', {
    header: 'Nom',
    cell({ row }) {
      const { firstName, lastName } = row.original
      return <span class="font-medium">{`${firstName} ${lastName}`.trim() || '—'}</span>
    },
  }),
  helper.accessor('email', {
    header: 'Email',
  }),
  helper.accessor('role', {
    header: 'Rôle',
    cell(props) {
      return <Badge variant="secondary">{props.getValue()}</Badge>
    },
  }),
  helper.accessor('createdAt', {
    header: 'Inscrit le',
    cell(props) {
      return <span>{formatDate(props.getValue()) ?? '—'}</span>
    },
  }),
])
