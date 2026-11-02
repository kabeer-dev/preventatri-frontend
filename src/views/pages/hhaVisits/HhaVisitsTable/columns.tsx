import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {
  GetHhaVisitColumnsOptions,
  HhaVisitCellType,
} from '@/shared/interfaces/hhaVisit';
import {
  formatHhaVisitDate,
  formatHhaVisitDateTime,
  formatHhaVisitName,
  formatHhaVisitType,
  formatHhaVisitWindow,
  resolveHhaVisitChip,
} from '@/shared/utils/hhaVisitUtils';

/**
 * Column definitions for the HHA Visits DataGrid. Every column is read-only
 * and server-sorted through the list filters, so DataGrid's own sorting is
 * switched off to avoid a client-side reorder of one page.
 */
export const getHhaVisitColumns = ({
  t,
}: GetHhaVisitColumnsOptions): GridColDef[] => [
  {
    flex: 0.12,
    minWidth: 120,
    sortable: false,
    field: 'visitDate',
    headerName: t('hhaVisits.table.headers.visitDate'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2'>
        {formatHhaVisitDate({date: row.visitDate})}
      </Typography>
    ),
  },
  {
    flex: 0.18,
    minWidth: 180,
    sortable: false,
    field: 'patient',
    headerName: t('hhaVisits.table.headers.patient'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2' sx={{fontWeight: 500}}>
        {formatHhaVisitName({
          firstName: row.patientFirstName,
          lastName: row.patientLastName,
        })}
      </Typography>
    ),
  },
  {
    flex: 0.18,
    minWidth: 180,
    sortable: false,
    field: 'caregiver',
    headerName: t('hhaVisits.table.headers.caregiver'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2' sx={{fontWeight: 500}}>
        {formatHhaVisitName({
          firstName: row.caregiverFirstName,
          lastName: row.caregiverLastName,
        })}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 160,
    sortable: false,
    field: 'scheduled',
    headerName: t('hhaVisits.table.headers.scheduled'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2'>
        {formatHhaVisitWindow({
          start: row.scheduledStartAt,
          end: row.scheduledEndAt,
          timeZone: row.timeZone,
        })}
      </Typography>
    ),
  },
  {
    // "Visit Time" is HHAeXchange's own name for the recorded window: the
    // confirmed clock-in/out, falling back to the raw EVV capture.
    flex: 0.15,
    minWidth: 160,
    sortable: false,
    field: 'visitTime',
    headerName: t('hhaVisits.table.headers.visitTime'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2'>
        {formatHhaVisitWindow({
          start: row.actualStartAt || row.evvStartAt,
          end: row.actualEndAt || row.evvEndAt,
          timeZone: row.timeZone,
        })}
      </Typography>
    ),
  },
  {
    flex: 0.12,
    minWidth: 130,
    sortable: false,
    field: 'status',
    headerName: t('hhaVisits.table.headers.status'),
    renderCell: ({row}: HhaVisitCellType) => {
      const chip = resolveHhaVisitChip({visit: row, t});

      return (
        <CustomChip
          skin='light'
          size='small'
          label={chip.label}
          color={chip.color}
          sx={{'& .MuiChip-label': {lineHeight: '18px'}}}
        />
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 120,
    sortable: false,
    field: 'visitType',
    headerName: t('hhaVisits.table.headers.visitType'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {formatHhaVisitType({visitType: row.visitType, t})}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 170,
    sortable: false,
    field: 'hhaModifiedDate',
    headerName: t('hhaVisits.table.headers.lastModified'),
    renderCell: ({row}: HhaVisitCellType) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {formatHhaVisitDateTime({
          date: row.hhaModifiedDate,
          timeZone: row.timeZone,
        })}
      </Typography>
    ),
  },
];
