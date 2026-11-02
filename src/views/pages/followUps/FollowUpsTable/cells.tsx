'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpTask} from '@/shared/interfaces/followUp';
import {
  formatDueDate,
  formatDueTime,
  getAssigneeName,
  getDueRelativeLabel,
  getLateMinutes,
  getRoleLabel,
  getSourceLabel,
} from '@/shared/utils/followUpUtils';
import {getFullName} from '@/shared/utils/general';

// Title with the patient underneath ("Kline, Dorothy").
export const TaskCell = ({task}: {task: FollowUpTask}) => (
  <Box sx={{minWidth: 0}}>
    <Typography noWrap variant='bodyStrong' sx={{display: 'block'}}>
      {task.title}
    </Typography>
    <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
      {getFullName({
        firstName: task.patient?.firstName,
        lastName: task.patient?.lastName,
        lastFirst: true,
      })}
    </Typography>
  </Box>
);

export const AssigneeCell = ({task}: {task: FollowUpTask}) => {
  const user = task.assignee?.user;

  if (!user) {
    return (
      <Typography variant='body2' sx={{color: 'text.disabled'}}>
        N/A
      </Typography>
    );
  }

  return (
    <UserGridCell
      firstName={user.firstName ?? ''}
      lastName={user.lastName ?? ''}
      meta={getRoleLabel({role: task.assignee?.role})}
    />
  );
};

// "22 Jun · 17:00 ET" with the relative line, red once late.
export const DueCell = ({task}: {task: FollowUpTask}) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const isLate = task.isOverdue || getLateMinutes({task}) > 0;

  return (
    <Box sx={{minWidth: 0}}>
      <Typography noWrap variant='body2'>
        {formatDueDate({dueAt: task.dueAt, zone})} ·{' '}
        {formatDueTime({dueAt: task.dueAt, zone})}
      </Typography>
      <Typography
        noWrap
        variant='small'
        sx={{
          color:
            isLate && task.status !== 'COMPLETED'
              ? 'error.main'
              : 'text.disabled',
          fontWeight: isLate ? 600 : 400,
        }}
      >
        {getDueRelativeLabel({task, t, zone})}
      </Typography>
    </Box>
  );
};

export const SourceCell = ({task}: {task: FollowUpTask}) => {
  const {t} = useTranslation();

  return (
    <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
      {getSourceLabel({source: task.source, t})}
    </Typography>
  );
};

export const getAssigneeCellText = ({task}: {task: FollowUpTask}) =>
  getAssigneeName({assignee: task.assignee});
