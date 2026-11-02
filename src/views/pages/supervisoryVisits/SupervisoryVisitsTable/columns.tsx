import {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';

import {SupervisoryVisit} from '@/shared/interfaces/supervisoryVisit';

import {
  AssigneeCell,
  CaregiversCell,
  PatientCell,
  ScheduleCell,
  StatusCell,
  VisitTypeCell,
} from './cells';

type VisitCellParams = GridRenderCellParams<SupervisoryVisit>;

export const getSupervisoryVisitColumns = ({
  t,
}: {
  t: (key: string) => string;
}): GridColDef[] => [
  {
    flex: 0.24,
    minWidth: 220,
    field: 'patient',
    headerName: t('supervisoryVisits.table.headers.patient'),
    sortable: false,
    renderCell: ({row}: VisitCellParams) => <PatientCell visit={row} />,
  },
  {
    flex: 0.16,
    minWidth: 150,
    field: 'visitType',
    headerName: t('supervisoryVisits.table.headers.visitType'),
    renderCell: ({row}: VisitCellParams) => <VisitTypeCell visit={row} />,
  },
  {
    flex: 0.18,
    minWidth: 180,
    field: 'assignee',
    headerName: t('supervisoryVisits.table.headers.nurse'),
    sortable: false,
    renderCell: ({row}: VisitCellParams) => <AssigneeCell visit={row} />,
  },
  {
    flex: 0.22,
    minWidth: 240,
    field: 'scheduledStartAt',
    headerName: t('supervisoryVisits.table.headers.scheduled'),
    renderCell: ({row}: VisitCellParams) => <ScheduleCell visit={row} />,
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'caregiversCount',
    headerName: t('supervisoryVisits.table.headers.caregivers'),
    sortable: false,
    renderCell: ({row}: VisitCellParams) => <CaregiversCell visit={row} />,
  },
  {
    flex: 0.14,
    minWidth: 140,
    field: 'status',
    headerName: t('supervisoryVisits.table.headers.status'),
    renderCell: ({row}: VisitCellParams) => <StatusCell visit={row} />,
  },
];
