import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {
  HHA_SYNC_RUN_STATUS,
  HHA_SYNC_TRIGGER_LABEL_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import {
  HhaSyncColumnsOptions,
  HhaSyncRunCell,
} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatSyncDateTime,
  formatSyncDuration,
  resolveSyncChip,
  sumRunCounters,
} from '@/shared/utils/hhaSyncHistoryUtils';

// Server-paginated and newest first, so DataGrid's own sorting is off.
export const getHhaSyncRunColumns = ({
  t,
  zone,
}: HhaSyncColumnsOptions): GridColDef[] => [
  {
    flex: 0.2,
    minWidth: 180,
    sortable: false,
    field: 'startedAt',
    headerName: t('hhaSyncHistory.runs.headers.startedAt'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography noWrap variant='body2'>
        {formatSyncDateTime({value: row.startedAt, zone})}
      </Typography>
    ),
  },
  {
    flex: 0.18,
    minWidth: 160,
    sortable: false,
    field: 'trigger',
    headerName: t('hhaSyncHistory.runs.headers.trigger'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography noWrap variant='body2'>
        {row.requestedBy?.name ||
          t(HHA_SYNC_TRIGGER_LABEL_KEYS[row.trigger] || row.trigger)}
      </Typography>
    ),
  },
  {
    flex: 0.14,
    minWidth: 130,
    sortable: false,
    field: 'status',
    headerName: t('hhaSyncHistory.runs.headers.status'),
    renderCell: ({row}: HhaSyncRunCell) => {
      const chip = resolveSyncChip({
        map: HHA_SYNC_RUN_STATUS,
        value: row.status,
        t,
      });

      return (
        <CustomChip
          skin='light'
          size='small'
          label={chip.label}
          color={chip.color}
        />
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 110,
    sortable: false,
    field: 'duration',
    headerName: t('hhaSyncHistory.runs.headers.duration'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography noWrap variant='body2'>
        {formatSyncDuration({
          startedAt: row.startedAt,
          finishedAt: row.finishedAt,
        })}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'created',
    headerName: t('hhaSyncHistory.runs.headers.created'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography variant='body2'>
        {sumRunCounters({run: row}).created}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'updated',
    headerName: t('hhaSyncHistory.runs.headers.updated'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography variant='body2'>
        {sumRunCounters({run: row}).updated}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'exceptions',
    headerName: t('hhaSyncHistory.runs.headers.exceptions'),
    renderCell: ({row}: HhaSyncRunCell) => (
      <Typography variant='body2'>
        {sumRunCounters({run: row}).exceptions}
      </Typography>
    ),
  },
];
