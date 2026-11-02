import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {HHA_SYNC_CHANGE_ACTION} from '@/shared/constants/hhaSyncHistory';
import {
  HhaSyncChangeCell,
  HhaSyncColumnsOptions,
} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatSyncDateTime,
  resolveResourceLabel,
  resolveSyncChip,
} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

import HhaSyncChangeFields from './HhaSyncChangeFields';

export const getHhaSyncChangeColumns = ({
  t,
  zone,
}: HhaSyncColumnsOptions): GridColDef[] => [
  {
    flex: 0.16,
    minWidth: 170,
    sortable: false,
    field: 'createdAt',
    headerName: t('hhaSyncHistory.changes.headers.when'),
    renderCell: ({row}: HhaSyncChangeCell) => (
      <Typography noWrap variant='body2'>
        {formatSyncDateTime({value: row.createdAt, zone})}
      </Typography>
    ),
  },
  {
    flex: 0.12,
    minWidth: 120,
    sortable: false,
    field: 'resource',
    headerName: t('hhaSyncHistory.changes.headers.type'),
    renderCell: ({row}: HhaSyncChangeCell) => (
      <Typography noWrap variant='body2'>
        {resolveResourceLabel({resource: row.resource, t})}
      </Typography>
    ),
  },
  {
    flex: 0.18,
    minWidth: 170,
    sortable: false,
    field: 'record',
    headerName: t('hhaSyncHistory.changes.headers.record'),
    renderCell: ({row}: HhaSyncChangeCell) => (
      <HhaSyncRecordLink
        record={row.record}
        fallback={t('hhaSyncHistory.changes.hhaId', {id: row.hhaRecordId})}
      />
    ),
  },
  {
    flex: 0.14,
    minWidth: 150,
    sortable: false,
    field: 'action',
    headerName: t('hhaSyncHistory.changes.headers.action'),
    renderCell: ({row}: HhaSyncChangeCell) => {
      const chip = resolveSyncChip({
        map: HHA_SYNC_CHANGE_ACTION,
        value: row.action,
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
    flex: 0.4,
    minWidth: 280,
    sortable: false,
    field: 'changes',
    headerName: t('hhaSyncHistory.changes.headers.fields'),
    renderCell: ({row}: HhaSyncChangeCell) => (
      <HhaSyncChangeFields entries={row.changes || []} action={row.action} />
    ),
  },
];
