import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {Patient} from '@/shared/interfaces/patient';
import {CellType} from '@/shared/interfaces/tables';

export const getCaregiverPatientColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef[] => [
  {
    flex: 0.3,
    minWidth: 220,
    field: 'name',
    headerName: t('caregiver.details.table.headers.patientName'),
    renderCell: ({row}: CellType<Patient>) => (
      <UserGridCell
        firstName={row.firstName}
        lastName={row.lastName}
        avatar={row.avatar}
        avatarColor={row.avatarColor}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'gender',
    headerName: t('patients.details.gender'),
    renderCell: ({row}: CellType<Patient>) => (
      <Typography
        noWrap
        variant='body2'
        sx={{color: 'text.secondary', textTransform: 'capitalize'}}
      >
        {row.gender ? row.gender : 'N/A'}
      </Typography>
    ),
  },
  {
    flex: 0.25,
    minWidth: 160,
    field: 'phoneNo',
    headerName: t('patients.details.phone'),
    renderCell: ({row}: CellType<Patient>) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {row.phoneNo || 'N/A'}
      </Typography>
    ),
  },
  {
    flex: 0.25,
    minWidth: 160,
    field: 'diagnosis',
    headerName: t('patients.table.headers.diagnosis'),
    renderCell: ({row}: CellType<Patient>) => (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {row.diagnosis || 'N/A'}
      </Typography>
    ),
  },
];
