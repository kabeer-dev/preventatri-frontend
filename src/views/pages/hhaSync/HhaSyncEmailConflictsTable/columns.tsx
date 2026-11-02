import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {
  HhaEmailConflictCell,
  HhaEmailConflictColumnsOptions,
} from '@/shared/interfaces/hhaSyncHistory';

import HhaEmailConflictMembers from './HhaEmailConflictMembers';

const KEY = 'hhaSyncHistory.emails';

export const getHhaEmailConflictColumns = ({
  t,
  onChangeEmail,
}: HhaEmailConflictColumnsOptions): GridColDef[] => [
  {
    flex: 0.26,
    minWidth: 220,
    sortable: false,
    field: 'email',
    headerName: t(`${KEY}.headers.email`),
    renderCell: ({row}: HhaEmailConflictCell) => (
      <Typography noWrap variant='bodyStrong' sx={{py: 2}}>
        {row.email}
      </Typography>
    ),
  },
  {
    flex: 0.56,
    minWidth: 600,
    sortable: false,
    field: 'members',
    headerName: t(`${KEY}.headers.people`),
    renderCell: ({row}: HhaEmailConflictCell) => (
      <HhaEmailConflictMembers conflict={row} onChangeEmail={onChangeEmail} />
    ),
  },
  {
    flex: 0.18,
    minWidth: 180,
    sortable: false,
    field: 'needsAttention',
    headerName: t(`${KEY}.headers.status`),
    renderCell: ({row}: HhaEmailConflictCell) => (
      <CustomChip
        skin='light'
        size='small'
        sx={{my: 2}}
        label={t(
          `${KEY}.${row.needsAttention ? 'needsAttention' : 'resolved'}`
        )}
        color={row.needsAttention ? 'error' : 'success'}
      />
    ),
  },
];
