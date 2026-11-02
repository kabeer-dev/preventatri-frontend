import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import {ASSESSMENT_CHECKLIST_DATE_FORMAT} from '@/shared/constants/assessmentChecklists';
import {AssessmentChecklist} from '@/shared/interfaces/assessmentChecklist';
import {CellType} from '@/shared/interfaces/tables';
import {
  getChecklistStatusConfig,
  getChecklistTypeLabelKey,
} from '@/shared/utils/assessmentChecklistUtils';
import {formatDate} from '@/shared/utils/dateUtils';

interface GetAssessmentChecklistColumnsOptions {
  t: (key: string) => string;
}

export const getAssessmentChecklistColumns = (
  options: GetAssessmentChecklistColumnsOptions
): GridColDef[] => {
  const {t} = options;

  return [
    {
      flex: 0.25,
      minWidth: 220,
      field: 'name',
      headerName: t('assessmentChecklists.table.headers.name'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{fontWeight: 500}}>
          {row.name}
        </Typography>
      ),
    },
    {
      flex: 0.3,
      minWidth: 260,
      field: 'description',
      headerName: t('assessmentChecklists.table.headers.description'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
          {row.description}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'sectionCount',
      headerName: t('assessmentChecklists.table.headers.sections'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
          {row.sectionCount}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'questionCount',
      headerName: t('assessmentChecklists.table.headers.questions'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
          {row.questionCount}
        </Typography>
      ),
    },
    {
      flex: 0.18,
      minWidth: 160,
      field: 'type',
      headerName: t('assessmentChecklists.table.headers.type'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
          {t(getChecklistTypeLabelKey({type: row.type}))}
        </Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: t('assessmentChecklists.table.headers.status'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => {
        const {labelKey, color} = getChecklistStatusConfig({
          status: row.status,
        });

        return <CustomChip label={t(labelKey)} color={color} />;
      },
    },
    {
      flex: 0.13,
      minWidth: 130,
      field: 'createdAt',
      headerName: t('assessmentChecklists.table.headers.createdAt'),
      renderCell: ({row}: CellType<AssessmentChecklist>) => (
        <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
          {formatDate({
            date: row.createdAt,
            format: ASSESSMENT_CHECKLIST_DATE_FORMAT,
          })}
        </Typography>
      ),
    },
  ];
};
