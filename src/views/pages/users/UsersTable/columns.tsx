import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {ENTITY_SOURCE} from '@/shared/constants/common';
import {
  ORG_USER_DATE_FORMAT,
  ORG_USER_EMPTY_CELL,
  ORG_USER_INVITATION_STATUS,
  ORG_USER_ROLES,
  ORG_USER_STATUS,
} from '@/shared/constants/orgUsers';
import {OrgUser, OrgUserRowActionHandlers} from '@/shared/interfaces/orgUser';
import {CellType} from '@/shared/interfaces/tables';
import {formatDate} from '@/shared/utils/dateUtils';

import OrgUserRowActions from './OrgUserRowActions';

interface GetOrgUserColumnsOptions extends OrgUserRowActionHandlers {
  t: (key: string, options?: Record<string, unknown>) => string;
}

const resolveRole = ({role}: {role: string}) =>
  Object.values(ORG_USER_ROLES).find((option) => option.value === role);

const resolveStatus = ({status}: {status: string}) =>
  ORG_USER_STATUS[status as keyof typeof ORG_USER_STATUS];

const resolveInvitationStatus = ({status}: {status: string}) =>
  ORG_USER_INVITATION_STATUS[status as keyof typeof ORG_USER_INVITATION_STATUS];

/**
 * Column definitions for the unified Users & Roles roster.
 *
 * The API sends raw enums; role, status and source are resolved to labels and
 * colours here.
 *
 * Nothing is sortable: the list is paginated server-side but the shared
 * DataTable does not forward a sort model, so MUI would reorder only the rows
 * on screen. The endpoint already accepts sortBy/sortDir when that is wired up.
 */
export const getOrgUserColumns = ({
  t,
  onEdit,
  onDelete,
  onResendInvitation,
  onCancelInvitation,
}: GetOrgUserColumnsOptions): GridColDef[] => [
  {
    flex: 0.26,
    minWidth: 200,
    sortable: false,
    field: 'user.firstName',
    headerName: t('orgUsers.table.headers.name'),
    renderCell: ({row}: CellType<OrgUser>) => (
      <UserGridCell
        firstName={row.firstName ?? ''}
        lastName={row.lastName ?? ''}
        meta={row.email ?? row.phoneNo ?? ''}
      />
    ),
  },
  {
    flex: 0.18,
    minWidth: 130,
    sortable: false,
    field: 'role',
    headerName: t('orgUsers.table.headers.role'),
    renderCell: ({row}: CellType<OrgUser>) => {
      const roleConfig = resolveRole({role: row.role});

      return (
        <CustomChip
          skin='light'
          size='small'
          label={roleConfig?.label ?? row.role}
          color={roleConfig?.color ?? 'default'}
        />
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 115,
    sortable: false,
    field: 'createdAt',
    headerName: t('orgUsers.table.headers.added'),
    renderCell: ({row}: CellType<OrgUser>) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {row.createdAt
          ? formatDate({date: row.createdAt, format: ORG_USER_DATE_FORMAT})
          : ORG_USER_EMPTY_CELL}
      </Typography>
    ),
  },
  {
    flex: 0.14,
    minWidth: 120,
    sortable: false,
    field: 'status',
    headerName: t('orgUsers.table.headers.status'),
    renderCell: ({row}: CellType<OrgUser>) => {
      const statusConfig = resolveStatus({status: row.status});

      if (row.archived) {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={t('orgUsers.archivedChip')}
            color='secondary'
          />
        );
      }

      return (
        <CustomChip
          skin='light'
          size='small'
          label={statusConfig?.label ?? row.status}
          color={statusConfig?.color ?? 'default'}
        />
      );
    },
  },
  {
    flex: 0.14,
    minWidth: 140,
    sortable: false,
    field: 'invitationStatus',
    headerName: t('orgUsers.table.headers.invitation'),
    renderCell: ({row}: CellType<OrgUser>) => (
      <CustomChip
        skin='light'
        size='small'
        label={t(`orgUsers.invitationStatuses.${row.invitationStatus}`)}
        color={
          resolveInvitationStatus({status: row.invitationStatus})?.color ??
          'default'
        }
      />
    ),
  },
  {
    flex: 0.12,
    minWidth: 140,
    sortable: false,
    field: 'source',
    headerName: t('orgUsers.table.headers.source'),
    renderCell: ({row}: CellType<OrgUser>) => {
      // The API sends the raw source enum; anything unrecognised reads as
      // Manual, which is what an un-synced record is.
      const sourceConfig =
        Object.values(ENTITY_SOURCE).find(
          (option) => option.value === row.source
        ) ?? ENTITY_SOURCE.manual;

      return (
        <CustomChip
          skin='light'
          size='small'
          label={sourceConfig.label}
          color={sourceConfig.color}
        />
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 130,
    sortable: false,
    field: 'action',
    headerName: t('orgUsers.table.headers.action'),
    renderCell: ({row}: CellType<OrgUser>) => (
      <OrgUserRowActions
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        onResendInvitation={onResendInvitation}
        onCancelInvitation={onCancelInvitation}
      />
    ),
  },
];
