import {GridColDef} from '@mui/x-data-grid';

import SeverityIndicator from '@/shared/components/common/severity';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {AssignedPatient} from '@/shared/interfaces/nurseDetails';

/**
 * Column definitions for the Assigned Patients table
 */

export const getAssignedPatientColumns = (): GridColDef<AssignedPatient>[] => [
  {
    flex: 0.25,
    minWidth: 200,
    field: 'patientName',
    headerName: 'PATIENT NAME',
    renderCell: ({row}) => (
      <UserGridCell
        firstName={row.firstName}
        lastName={row.lastName}
        avatar={row.avatar}
        avatarColor={row.avatarColor}
      />
    ),
  },
  {
    flex: 0.35,
    minWidth: 250,
    field: 'caregiver',
    headerName: 'CAREGIVER',
    renderCell: ({row}) => (
      <UserGridCell
        firstName={row.caregiverFirstName}
        lastName={row.caregiverLastName}
        meta={row.caregiverEmail}
        avatar={row.caregiverAvatar}
        avatarColor={row.caregiverAvatarColor || 'success'}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 140,
    field: 'flagStatus',
    headerName: 'FLAG STATUS',
    renderCell: ({row}) => {
      return <SeverityIndicator flag={row.flagStatus} />;
    },
  },
];
