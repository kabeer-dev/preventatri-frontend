import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {
  HHA_SYNC_EXCEPTION_STATUS,
  HHA_SYNC_FIX_IN_CHIP,
  HHA_SYNC_WAITING_PERSON_TYPES,
} from '@/shared/constants/hhaSyncHistory';
import {
  HhaSyncColumnsOptions,
  HhaSyncExceptionCell,
} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatSyncDateTime,
  getExceptionCopy,
  getExceptionTypeMeta,
  resolveResourceLabel,
  resolveSyncChip,
} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

export const getHhaSyncExceptionColumns = ({
  t,
  zone,
}: HhaSyncColumnsOptions): GridColDef[] => [
  {
    flex: 0.26,
    minWidth: 230,
    sortable: false,
    field: 'type',
    headerName: t('hhaSyncHistory.exceptions.headers.type'),
    renderCell: ({row}: HhaSyncExceptionCell) => (
      <Box sx={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
        <Typography noWrap variant='bodyStrong'>
          {getExceptionCopy({type: row.type, t}).title}
        </Typography>
        <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
          {resolveResourceLabel({resource: row.resource, t})}
          {row.detail ? ` · ${row.detail}` : ''}
        </Typography>
      </Box>
    ),
  },
  {
    flex: 0.2,
    minWidth: 170,
    sortable: false,
    field: 'record',
    headerName: t('hhaSyncHistory.exceptions.headers.record'),
    renderCell: ({row}: HhaSyncExceptionCell) =>
      HHA_SYNC_WAITING_PERSON_TYPES.includes(row.type) && row.relatedUser ? (
        <Box sx={{display: 'flex', flexDirection: 'column', minWidth: 0}}>
          <HhaSyncRecordLink
            record={{
              kind: row.relatedUser.profile.kind,
              id: row.relatedUser.profile.id,
              name: row.relatedUser.name,
            }}
            fallback={row.relatedUser.name}
          />
          <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
            {t('hhaSyncHistory.exceptions.waiting.count', {
              count: `${row.waitingPatientCount ?? 0}`,
            })}
          </Typography>
        </Box>
      ) : (
        <HhaSyncRecordLink
          record={row.record}
          fallback={
            row.hhaRecordId
              ? t('hhaSyncHistory.changes.hhaId', {id: row.hhaRecordId})
              : DETAIL_EMPTY_VALUE
          }
        />
      ),
  },
  {
    flex: 0.16,
    minWidth: 160,
    sortable: false,
    field: 'fixIn',
    headerName: t('hhaSyncHistory.exceptions.headers.fixIn'),
    renderCell: ({row}: HhaSyncExceptionCell) => {
      const chip = resolveSyncChip({
        map: HHA_SYNC_FIX_IN_CHIP,
        value: getExceptionTypeMeta({type: row.type}).fixIn,
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
    flex: 0.13,
    minWidth: 130,
    sortable: false,
    field: 'status',
    headerName: t('hhaSyncHistory.exceptions.headers.status'),
    renderCell: ({row}: HhaSyncExceptionCell) => {
      const chip = resolveSyncChip({
        map: HHA_SYNC_EXCEPTION_STATUS,
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
    flex: 0.08,
    minWidth: 90,
    sortable: false,
    field: 'occurrences',
    headerName: t('hhaSyncHistory.exceptions.headers.occurrences'),
    renderCell: ({row}: HhaSyncExceptionCell) => (
      <Typography variant='body2'>{row.occurrences}</Typography>
    ),
  },
  {
    flex: 0.17,
    minWidth: 170,
    sortable: false,
    field: 'lastSeenAt',
    headerName: t('hhaSyncHistory.exceptions.headers.lastSeen'),
    renderCell: ({row}: HhaSyncExceptionCell) => (
      <Typography noWrap variant='body2'>
        {formatSyncDateTime({value: row.lastSeenAt, zone})}
      </Typography>
    ),
  },
];
