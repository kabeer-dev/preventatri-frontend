'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import ConfigChip from '@/shared/components/common/chips/ConfigChip';
import WorkItemFact, {
  WorkItemSectionTitle,
} from '@/shared/components/common/WorkItemFact';
import {SUPERVISORY_VISIT_STATUS} from '@/shared/constants/supervisoryVisits';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitCardProps} from '@/shared/interfaces/supervisoryVisit';
import {
  formatScheduleRange,
  getVisitLateMinutes,
  getVisitStatusConfig,
  getVisitTypeLabel,
} from '@/shared/utils/supervisoryVisitUtils';
import {
  formatDurationLabel,
  formatHistoryTime,
  getAlertTypeLabelKey,
  getAssigneeName,
  getPersonName,
  getRoleLabel,
} from '@/shared/utils/workItemUtils';

const SupervisoryVisitFactsCard = ({visit}: SupervisoryVisitCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const isCancelled = visit.status === SUPERVISORY_VISIT_STATUS.CANCELLED.value;

  const assigneeLine = [
    getAssigneeName({assignee: visit.assignee}),
    getRoleLabel({role: visit.assignee?.role}),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <WorkItemSectionTitle>
          {t('supervisoryVisits.detail.visitDetails')}
        </WorkItemSectionTitle>
        <WorkItemFact
          label={t('supervisoryVisits.detail.status')}
          value={
            visit.isOverdue ? (
              <Typography
                variant='body2'
                sx={{color: 'error.main', fontWeight: 600}}
              >
                {t('followUps.due.overdueBy', {
                  duration: formatDurationLabel({
                    minutes: getVisitLateMinutes({visit}),
                    t,
                  }),
                })}
              </Typography>
            ) : (
              <ConfigChip
                config={getVisitStatusConfig({status: visit.status})}
              />
            )
          }
        />
        <WorkItemFact
          label={t('supervisoryVisits.detail.visitType')}
          value={getVisitTypeLabel({visit, t})}
        />
        <WorkItemFact
          label={t('supervisoryVisits.detail.assignee')}
          value={
            <>
              {assigneeLine}
              {visit.originalAssignee && (
                <Typography
                  variant='small'
                  sx={{display: 'block', color: 'text.disabled'}}
                >
                  {t('followUps.detail.originally', {
                    name: getAssigneeName({assignee: visit.originalAssignee}),
                  })}
                </Typography>
              )}
            </>
          }
        />
        <WorkItemFact
          label={t('supervisoryVisits.detail.scheduledFor')}
          value={formatScheduleRange({visit, zone})}
        />
        <WorkItemFact
          label={t('supervisoryVisits.detail.created')}
          value={t('followUps.detail.createdBy', {
            name: getPersonName({person: visit.createdByUser}),
            date: formatHistoryTime({value: visit.createdAt, zone}),
          })}
        />
        <WorkItemFact
          label={t('supervisoryVisits.detail.source')}
          value={
            visit.source.alert
              ? t(getAlertTypeLabelKey({alert: visit.source.alert}))
              : t('followUps.sources.standalone')
          }
        />
        {visit.completedAt && (
          <WorkItemFact
            label={t('supervisoryVisits.detail.filedBy')}
            value={t('followUps.detail.createdBy', {
              name: getPersonName({person: visit.completedByUser}),
              date: formatHistoryTime({value: visit.completedAt, zone}),
            })}
          />
        )}

        {isCancelled && (
          <Box className='mt-5'>
            <WorkItemSectionTitle>
              {t('supervisoryVisits.statuses.cancelled')}
            </WorkItemSectionTitle>
            <WorkItemFact
              label={t('supervisoryVisits.detail.cancelReason')}
              value={visit.cancelReason}
            />
            <Typography
              variant='small'
              sx={{display: 'block', mt: 1, color: 'text.disabled'}}
            >
              {t('followUps.detail.cancelledBy', {
                name: getPersonName({person: visit.cancelledByUser}),
                date: visit.cancelledAt
                  ? formatHistoryTime({value: visit.cancelledAt, zone})
                  : '',
              })}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisoryVisitFactsCard;
