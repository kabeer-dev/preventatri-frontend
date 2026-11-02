'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import WorkItemFact, {
  WorkItemSectionTitle,
} from '@/shared/components/common/WorkItemFact';
import {FOLLOW_UP_TASK_STATUS} from '@/shared/constants/followUps';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpTaskCardProps} from '@/shared/interfaces/followUp';
import {
  formatDueDateTime,
  formatDurationLabel,
  formatHistoryTime,
  getAssigneeName,
  getLateMinutes,
  getPersonName,
  getRoleLabel,
  getSourceLabel,
} from '@/shared/utils/followUpUtils';
import {
  getPriorityConfig,
  getStatusConfig,
  getOutcomeConfig,
} from '@/shared/utils/followUpUtils';
import FollowUpChip from '@/views/pages/followUps/components/FollowUpChip';

const FollowUpTaskFactsCard = ({task}: FollowUpTaskCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const isCompleted = task.status === FOLLOW_UP_TASK_STATUS.COMPLETED.value;
  const isCancelled = task.status === FOLLOW_UP_TASK_STATUS.CANCELLED.value;
  const lateMinutes = getLateMinutes({task});

  const assigneeLine = [
    getAssigneeName({assignee: task.assignee}),
    getRoleLabel({role: task.assignee?.role}),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <WorkItemSectionTitle>
          {t('followUps.detail.taskDetails')}
        </WorkItemSectionTitle>
        <WorkItemFact
          label={t('followUps.detail.status')}
          value={
            task.isOverdue ? (
              <Typography
                variant='body2'
                sx={{color: 'error.main', fontWeight: 600}}
              >
                {t('followUps.due.overdueBy', {
                  duration: formatDurationLabel({minutes: lateMinutes, t}),
                })}
              </Typography>
            ) : (
              <FollowUpChip config={getStatusConfig({status: task.status})} />
            )
          }
        />
        <WorkItemFact
          label={t('followUps.detail.assignee')}
          value={
            <>
              {assigneeLine}
              {task.originalAssignee && (
                <Typography
                  variant='small'
                  sx={{display: 'block', color: 'text.disabled'}}
                >
                  {t('followUps.detail.originally', {
                    name: getAssigneeName({assignee: task.originalAssignee}),
                  })}
                </Typography>
              )}
            </>
          }
        />
        <WorkItemFact
          label={t(
            isCompleted ? 'followUps.detail.dueWas' : 'followUps.detail.due'
          )}
          value={formatDueDateTime({dueAt: task.dueAt, zone})}
        />
        <WorkItemFact
          label={t('followUps.detail.priority')}
          value={
            <FollowUpChip
              config={getPriorityConfig({priority: task.priority})}
            />
          }
        />
        <WorkItemFact
          label={t('followUps.detail.created')}
          value={t('followUps.detail.createdBy', {
            name: getPersonName({person: task.createdByUser}),
            date: formatHistoryTime({value: task.createdAt, zone}),
          })}
        />
        <WorkItemFact
          label={t('followUps.detail.source')}
          value={getSourceLabel({source: task.source, t})}
        />

        {isCompleted && (
          <Box className='mt-5'>
            <WorkItemSectionTitle>
              {t('followUps.detail.completion')}
            </WorkItemSectionTitle>
            <WorkItemFact
              label={t('followUps.detail.completedBy')}
              value={getPersonName({person: task.completedByUser})}
            />
            <WorkItemFact
              label={t('followUps.detail.completedAt')}
              value={
                task.completedAt
                  ? formatHistoryTime({value: task.completedAt, zone})
                  : ''
              }
            />
            <WorkItemFact
              label={t('followUps.detail.againstDue')}
              value={t(
                lateMinutes > 0
                  ? 'followUps.due.completedLate'
                  : 'followUps.due.completedEarly',
                {duration: formatDurationLabel({minutes: lateMinutes, t})}
              )}
            />
            <WorkItemFact
              label={t('followUps.detail.outcome')}
              value={
                <FollowUpChip
                  config={getOutcomeConfig({outcome: task.completionOutcome})}
                />
              }
            />
          </Box>
        )}

        {isCancelled && (
          <Box className='mt-5'>
            <WorkItemSectionTitle>
              {t('followUps.statuses.cancelled')}
            </WorkItemSectionTitle>
            <WorkItemFact
              label={t('followUps.detail.cancelReason')}
              value={task.cancelReason}
            />
            <Typography
              variant='small'
              sx={{display: 'block', mt: 1, color: 'text.disabled'}}
            >
              {t('followUps.detail.cancelledBy', {
                name: getPersonName({person: task.cancelledByUser}),
                date: task.cancelledAt
                  ? formatHistoryTime({value: task.cancelledAt, zone})
                  : '',
              })}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpTaskFactsCard;
