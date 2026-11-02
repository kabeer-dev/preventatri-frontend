import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import SeverityIndicator from '@/shared/components/common/severity';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {PatientChecklistReport} from '@/shared/interfaces/patientDetails';
import {ChecklistAssignmentItem} from '@/shared/interfaces/userProfile';

/**
 * Column definitions for the Recent Checklist Report table
 */

export const getChecklistReportColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef<PatientChecklistReport>[] => [
  {
    flex: 0.25,
    minWidth: 200,
    field: 'caregiver',
    headerName: t('patients.details.table.headers.caregiver'),
    renderCell: ({row}) => (
      <UserGridCell
        firstName={row.caregiverFirstName}
        lastName={row.caregiverLastName}
        avatar={row.caregiverAvatar}
        avatarColor={row.caregiverAvatarColor}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'date',
    headerName: t('patients.details.table.headers.date'),
    renderCell: ({row}) => (
      <Typography variant='body2' sx={{color: 'text.secondary'}}>
        {row.date}
      </Typography>
    ),
  },
  {
    flex: 0.25,
    minWidth: 150,
    field: 'healthStat',
    headerName: t('patients.details.table.headers.healthStat'),
    renderCell: ({row}) => {
      return <SeverityIndicator flag={row.healthStat} />;
    },
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'type',
    headerName: t('patients.details.table.headers.type'),
    renderCell: ({row}) => (
      <Typography variant='body2' sx={{color: 'text.secondary'}}>
        {row.type}
      </Typography>
    ),
  },
];

export const getPatientAssignmentColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef<ChecklistAssignmentItem>[] => [
  {
    flex: 0.3,
    minWidth: 200,
    field: 'checklistName',
    headerName: t('patients.details.assignments.checklist'),
    renderCell: ({row}) => (
      <Typography sx={{fontWeight: 600}}>{row.checklistName}</Typography>
    ),
  },
  {
    flex: 0.25,
    minWidth: 170,
    field: 'caregiverName',
    headerName: t('patients.details.assignments.caregiver'),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'frequency',
    headerName: t('patients.details.assignments.frequency'),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'startDate',
    headerName: t('patients.details.assignments.startDate'),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'endDate',
    headerName: t('patients.details.assignments.endDate'),
  },
];
