'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import Link from '@/shared/components/common/localeLink';
import {
  CASE_MANAGER_CHECKLIST_DUE_DATE_FORMAT,
  CASE_MANAGER_CHECKLIST_TABLE_MIN_WIDTH,
  CASE_MANAGER_CHECKLIST_TASK_STATUSES,
  CASE_MANAGER_DASHBOARD_ITEM_TYPES,
} from '@/shared/constants/caseManagerDashboard';
import {PANEL_CARD} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseManagerChecklistTaskRowProps} from '@/shared/interfaces/caseManager';
import {formatDate, isBeforeToday, isToday} from '@/shared/utils/dateUtils';

// Fixed tracks for the chip columns: each row is its own grid, so auto widths drift per row.
export const CHECKLIST_TASK_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: '80px minmax(0, 2fr) minmax(0, 1.2fr) 150px 110px',
  minWidth: CASE_MANAGER_CHECKLIST_TABLE_MIN_WIDTH,
  columnGap: 4,
  alignItems: 'center',
  justifyItems: 'start',
  px: PANEL_CARD.paddingX,
} as const;

const getTaskStatus = ({dueDate}: {dueDate: string}) => {
  if (isBeforeToday({value: dueDate}))
    return CASE_MANAGER_CHECKLIST_TASK_STATUSES.OVERDUE;

  if (isToday({value: dueDate}))
    return CASE_MANAGER_CHECKLIST_TASK_STATUSES.DUE_TODAY;

  return CASE_MANAGER_CHECKLIST_TASK_STATUSES.PENDING;
};

const ChecklistTaskRow = ({item}: CaseManagerChecklistTaskRowProps) => {
  const {t} = useTranslation();

  const itemType = CASE_MANAGER_DASHBOARD_ITEM_TYPES[item.type];
  const status = getTaskStatus({dueDate: item.dueDate});
  const isOverdue = status === CASE_MANAGER_CHECKLIST_TASK_STATUSES.OVERDUE;

  return (
    <Box
      component={Link}
      href={itemType.submitRoute({id: item.id})}
      sx={Object.assign({}, CHECKLIST_TASK_GRID_SX, {
        py: 3,
        borderTop: '1px solid',
        borderColor: 'customColors.rule',
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {backgroundColor: 'action.hover'},
      })}
    >
      <Typography
        variant='mono'
        sx={{color: isOverdue ? 'error.main' : 'text.primary'}}
      >
        {formatDate({
          date: item.dueDate,
          format: CASE_MANAGER_CHECKLIST_DUE_DATE_FORMAT,
        })}
      </Typography>
      <Typography variant='bodyStrong' noWrap sx={{maxWidth: '100%'}}>
        {item.checklistTitle || t(itemType.labelKey)}
      </Typography>
      <Typography
        variant='small'
        noWrap
        sx={{maxWidth: '100%', color: 'text.secondary'}}
      >
        {item.patientName}
      </Typography>
      <CustomChip
        size='small'
        label={t(itemType.labelKey)}
        color={itemType.color}
      />
      <CustomChip
        size='small'
        skin='light'
        label={t(status.labelKey)}
        color={status.color}
      />
    </Box>
  );
};

export default ChecklistTaskRow;
