import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import SeverityIndicator from '@/shared/components/common/severity';
import DataTableRowActions from '@/shared/components/common/table/DataTableRowActions';
import {
  SKIPPABLE_STATUSES,
  SUBMISSION_DAY_FORMAT,
  VOIDABLE_STATUSES,
} from '@/shared/constants/assessmentChecklists';
import {Submission} from '@/shared/interfaces/submission';
import {CellType} from '@/shared/interfaces/tables';
import {RowAction} from '@/shared/types/tables';

import {DueCell, OrgDateCell, ScheduleCell, StatusCell} from './cells';

interface GetSubmissionColumnsOptions {
  onEdit?: RowAction;
  onVoid?: RowAction;
  onSkip?: RowAction;
  showActions?: boolean;
  showEdit?: boolean;
  showPatient?: boolean;
  showCaregiver?: boolean;

  /** Caregivers never void, so their tables skip the voided date. */
  showVoidedAt?: boolean;
  t: (key: string) => string;
}

// Sized so every column fits a laptop-width table without scrolling.
const DEFAULT_COLUMN_FLEX = 1;
const DEFAULT_COLUMN_MIN_WIDTH = 120;
const NAME_COLUMN_FLEX = 1.5;
const NAME_COLUMN_MIN_WIDTH = 180;
const ACTIONS_COLUMN_WIDTH = 110;

export const getSubmissionColumns = ({
  onEdit,
  onVoid,
  onSkip,
  showActions = true,
  showEdit = true,
  showPatient = true,
  showCaregiver = true,
  showVoidedAt = true,
  t,
}: GetSubmissionColumnsOptions): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      flex: NAME_COLUMN_FLEX,
      minWidth: NAME_COLUMN_MIN_WIDTH,
      field: 'checklistName',
      headerName: t(
        showPatient
          ? 'submissions.table.headers.checklistAndPatient'
          : 'submissions.table.headers.checklistName'
      ),
      renderCell: ({row}: CellType<Submission>) => (
        <Box sx={{minWidth: 0}}>
          <Typography noWrap variant='bodyStrong'>
            {row.checklistName}
          </Typography>
          {showPatient && row.patientName && (
            <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
              {row.patientName}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'scheduleType',
      sortable: false,
      headerName: t('submissions.table.headers.schedule'),
      renderCell: ({row}: CellType<Submission>) => <ScheduleCell row={row} />,
    },
    {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'dueDate',
      headerName: t('submissions.table.headers.due'),
      renderCell: ({row}: CellType<Submission>) => <DueCell row={row} />,
    },
    {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'submittedAt',
      headerName: t('submissions.table.headers.submittedAt'),
      renderCell: ({row}: CellType<Submission>) => (
        <OrgDateCell date={row.submittedAt} format={SUBMISSION_DAY_FORMAT} />
      ),
    },
    {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'riskFlag',
      headerName: t('submissions.table.headers.riskFlag'),
      renderCell: ({row}: CellType<Submission>) => (
        <SeverityIndicator flag={row.riskFlag} />
      ),
    },
    {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'status',
      headerName: t('submissions.table.headers.status'),
      renderCell: ({row}: CellType<Submission>) => (
        <StatusCell row={row} showVoidedAt={showVoidedAt} />
      ),
    },
  ];

  if (showCaregiver) {
    columns.splice(1, 0, {
      flex: DEFAULT_COLUMN_FLEX,
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      field: 'caregiverName',
      headerName: t('submissions.table.headers.caregiverName'),
      renderCell: ({row}: CellType<Submission>) => (
        <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
          {row.caregiverName}
        </Typography>
      ),
    });
  }

  if (showActions) {
    columns.push({
      width: ACTIONS_COLUMN_WIDTH,
      sortable: false,
      field: 'action',
      headerName: t('submissions.table.headers.action'),
      renderCell: ({row}: CellType<Submission>) => (
        <DataTableRowActions
          id={row.id}
          onEdit={onEdit}
          showEdit={showEdit}
          showDelete={false}
          showVoid={
            !row.voidedAt &&
            (VOIDABLE_STATUSES as readonly string[]).includes(row.status)
          }
          onVoid={onVoid}
          showSkip={(SKIPPABLE_STATUSES as readonly string[]).includes(
            row.status
          )}
          onSkip={onSkip}
          skipLabel={t('submissions.actions.skip')}
        />
      ),
    });
  }

  return columns;
};
