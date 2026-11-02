import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import SeverityIndicator from '@/shared/components/common/severity';
import AlertAgeTimer from '@/shared/components/common/timers/AlertAgeTimer';
import {getRedFlagStatusConfig} from '@/shared/constants/redFlag';
import {TRIAGE_ALERT_TITLE_KEY} from '@/shared/constants/triageEngine';
import {CellType} from '@/shared/interfaces/tables';
import {TriageAlert} from '@/shared/interfaces/triageEngine';
import {getFullName} from '@/shared/utils/general';

const SEVERITY_COLUMN_WIDTH = 150;
const STATUS_COLUMN_WIDTH = 150;
const RAISED_COLUMN_WIDTH = 160;

export const getTriageAlertColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef[] => [
  {
    width: SEVERITY_COLUMN_WIDTH,
    field: 'flag',
    headerName: t('triageEngine.alerts.headers.severity'),
    renderCell: ({row}: CellType<TriageAlert>) => (
      <SeverityIndicator flag={row.flag} />
    ),
  },
  {
    flex: 1,
    minWidth: 220,
    sortable: false,
    field: 'type',
    headerName: t('triageEngine.alerts.headers.alert'),
    renderCell: ({row}: CellType<TriageAlert>) => {
      const patientName = getFullName({
        firstName: row.patient?.firstName,
        lastName: row.patient?.lastName,
      });

      return (
        <Box sx={{minWidth: 0}}>
          <Typography noWrap variant='bodyStrong'>
            {t(TRIAGE_ALERT_TITLE_KEY[row.type])}
          </Typography>
          {patientName && (
            <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
              {patientName}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    width: STATUS_COLUMN_WIDTH,
    field: 'status',
    headerName: t('triageEngine.alerts.headers.status'),
    renderCell: ({row}: CellType<TriageAlert>) => {
      const {label, color} = getRedFlagStatusConfig({status: row.status, t});

      return <CustomChip label={label} color={color} />;
    },
  },
  {
    width: RAISED_COLUMN_WIDTH,
    field: 'createdAt',
    headerName: t('triageEngine.alerts.headers.raised'),
    renderCell: ({row}: CellType<TriageAlert>) => (
      <AlertAgeTimer
        createdAt={row.createdAt}
        status={row.status}
        resolvedAt={row.resolvedAt}
        acceptedAt={row.acceptedAt}
        noWrap
        variant='body'
        sx={{color: 'text.secondary'}}
      />
    ),
  },
];
