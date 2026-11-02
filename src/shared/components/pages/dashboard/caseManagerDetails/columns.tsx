import {GridColDef} from '@mui/x-data-grid';

import SeverityIndicator from '@/shared/components/common/severity';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {CaseManagerAssignedPatient} from '@/shared/interfaces/caseManagerDetails';

export const getAssignedPatientColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef<CaseManagerAssignedPatient>[] => [
  {
    flex: 0.3,
    minWidth: 200,
    field: 'patientName',
    headerName: t('caseManager.details.table.headers.patientName'),
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
    flex: 0.2,
    minWidth: 140,
    field: 'flagStatus',
    headerName: t('caseManager.details.table.headers.flagStatus'),
    renderCell: ({row}) => {
      return <SeverityIndicator flag={row.flagStatus} />;
    },
  },
];
