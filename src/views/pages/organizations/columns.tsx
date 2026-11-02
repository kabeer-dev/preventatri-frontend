import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {
  ORGANIZATION_DATE_FORMAT,
  ORGANIZATION_EMPTY_CELL,
  ORGANIZATION_STATUS,
} from '@/shared/constants/superAdmin';
import {
  ManagedOrganization,
  OrganizationActionHandlers,
} from '@/shared/interfaces/superAdmin';
import {CellType} from '@/shared/interfaces/tables';
import {formatDate} from '@/shared/utils/dateUtils';

import OrganizationRowActions from './OrganizationRowActions';

interface GetOrganizationColumnsOptions extends OrganizationActionHandlers {
  t: (key: string, options?: Record<string, unknown>) => string;
}

/** Column definitions for the super admin's organizations list. */
export const getOrganizationColumns = ({
  t,
  onAction,
}: GetOrganizationColumnsOptions): GridColDef[] => [
  {
    flex: 0.2,
    minWidth: 180,
    sortable: false,
    field: 'organizationName',
    headerName: t('superAdmin.table.headers.organization'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <Typography noWrap variant='bodyStrong'>
        {row.organizationName}
      </Typography>
    ),
  },
  {
    flex: 0.24,
    minWidth: 220,
    sortable: false,
    field: 'creator',
    headerName: t('superAdmin.table.headers.admin'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <UserGridCell
        firstName={row.creator?.firstName ?? ''}
        lastName={row.creator?.lastName ?? ''}
        meta={row.creator?.email ?? ''}
      />
    ),
  },
  {
    flex: 0.11,
    minWidth: 110,
    sortable: false,
    field: 'status',
    headerName: t('superAdmin.table.headers.status'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <CustomChip
        skin='light'
        size='small'
        label={t(`superAdmin.statuses.${row.status}`)}
        color={ORGANIZATION_STATUS[row.status]?.color ?? 'default'}
      />
    ),
  },
  {
    flex: 0.11,
    minWidth: 115,
    sortable: false,
    field: 'createdAt',
    headerName: t('superAdmin.table.headers.created'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {formatDate({date: row.createdAt, format: ORGANIZATION_DATE_FORMAT})}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 160,
    sortable: false,
    field: 'statusReason',
    headerName: t('superAdmin.table.headers.reason'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <Typography
        noWrap
        variant='body2'
        title={row.statusReason ?? undefined}
        sx={{color: 'text.secondary'}}
      >
        {row.statusReason || ORGANIZATION_EMPTY_CELL}
      </Typography>
    ),
  },
  {
    flex: 0.14,
    minWidth: 170,
    sortable: false,
    field: 'actions',
    headerName: t('superAdmin.table.headers.actions'),
    renderCell: ({row}: CellType<ManagedOrganization>) => (
      <OrganizationRowActions row={row} onAction={onAction} />
    ),
  },
];
