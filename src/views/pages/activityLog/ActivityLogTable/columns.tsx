import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {AuditLogEntry} from '@/shared/interfaces/activityLog';
import {
  getAuditLogActionColor,
  getAuditLogActionLabel,
} from '@/shared/utils/activityLogUtils';
import {formatDate} from '@/shared/utils/dateUtils';

interface ActivityLogCellType {
  row: AuditLogEntry;
}

// Two-line cell: a primary line and a quieter meta line underneath, used for
// both the actor and resource columns.
const StackedCell = ({primary, meta}: {primary: string; meta?: string}) => (
  <Box sx={{minWidth: 0, py: 1}}>
    <Typography noWrap variant='body2' sx={{fontWeight: 500}}>
      {primary}
    </Typography>
    {meta && (
      <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
        {meta}
      </Typography>
    )}
  </Box>
);

export const getActivityLogColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef[] => [
  {
    flex: 0.14,
    minWidth: 150,
    sortable: false,
    field: 'timestamp',
    headerName: t('activityLog.table.headers.timestamp'),
    renderCell: ({row}: ActivityLogCellType) => (
      <Typography noWrap variant='body2'>
        {formatDate({date: row.timestamp, format: 'dd LLL HH:mm:ss'})}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 190,
    sortable: false,
    field: 'actor',
    headerName: t('activityLog.table.headers.actor'),
    renderCell: ({row}: ActivityLogCellType) => (
      <StackedCell
        primary={row.actor.name}
        meta={
          row.actor.region
            ? `${row.actor.role} · ${row.actor.region.county}`
            : row.actor.role
        }
      />
    ),
  },
  {
    flex: 0.12,
    minWidth: 120,
    sortable: false,
    field: 'action',
    headerName: t('activityLog.table.headers.action'),
    renderCell: ({row}: ActivityLogCellType) => {
      const {bg, fg} = getAuditLogActionColor({action: row.action});

      return (
        <CustomChip
          size='small'
          color='default'
          label={getAuditLogActionLabel({action: row.action, t})}
          sx={{backgroundColor: bg, color: fg}}
        />
      );
    },
  },
  {
    flex: 0.34,
    minWidth: 260,
    sortable: false,
    field: 'resource',
    headerName: t('activityLog.table.headers.resource'),
    renderCell: ({row}: ActivityLogCellType) => {
      const primaryRecord = row.relatedRecords?.[0];

      return (
        <StackedCell
          primary={primaryRecord?.label ?? row.resourceLabel}
          meta={primaryRecord?.sublabel ?? row.description}
        />
      );
    },
  },
];
