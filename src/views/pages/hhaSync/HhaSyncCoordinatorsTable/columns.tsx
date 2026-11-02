import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import HhaCoordinatorList from '@/shared/components/common/hhaSync/HhaCoordinatorList';
import {HHA_SYNC_PATIENT_KIND} from '@/shared/constants/hhaSyncHistory';
import {
  HhaCoordinatorColumnsOptions,
  HhaCoordinatorPatientCell,
} from '@/shared/interfaces/hhaSyncHistory';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

const KEY = 'hhaSyncHistory.coordinators';

export const getHhaCoordinatorColumns = ({
  t,
  onChoose,
}: HhaCoordinatorColumnsOptions): GridColDef[] => [
  {
    flex: 0.24,
    minWidth: 200,
    sortable: false,
    field: 'name',
    headerName: t(`${KEY}.headers.patient`),
    renderCell: ({row}: HhaCoordinatorPatientCell) => (
      <Typography component='div' sx={{py: 2, minWidth: 0}}>
        <HhaSyncRecordLink
          record={{
            kind: HHA_SYNC_PATIENT_KIND,
            id: row.patientId,
            name: row.name,
          }}
          fallback={row.name}
        />
      </Typography>
    ),
  },
  {
    flex: 0.4,
    minWidth: 320,
    sortable: false,
    field: 'coordinators',
    headerName: t(`${KEY}.headers.coordinators`),
    renderCell: ({row}: HhaCoordinatorPatientCell) => (
      <HhaCoordinatorList coordinators={row.coordinators} />
    ),
  },
  {
    flex: 0.18,
    minWidth: 190,
    sortable: false,
    field: 'isChosen',
    headerName: t(`${KEY}.headers.choice`),
    renderCell: ({row}: HhaCoordinatorPatientCell) => (
      <CustomChip
        skin='light'
        size='small'
        sx={{my: 2}}
        label={t(`${KEY}.${row.isChosen ? 'chosen' : 'firstByDefault'}`)}
        color={row.isChosen ? 'success' : 'warning'}
      />
    ),
  },
  {
    flex: 0.18,
    minWidth: 190,
    sortable: false,
    field: 'action',
    headerName: t(`${KEY}.headers.action`),
    renderCell: ({row}: HhaCoordinatorPatientCell) => (
      <Button
        size='small'
        variant='outlined'
        sx={{my: 1.5}}
        onClick={() =>
          onChoose({
            patientId: row.patientId,
            name: row.name,
            coordinators: row.coordinators,
          })
        }
      >
        {t(`${KEY}.choose`)}
      </Button>
    ),
  },
];
