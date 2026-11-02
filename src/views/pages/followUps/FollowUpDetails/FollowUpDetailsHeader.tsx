'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CustomChip from '@/@core/components/mui/chip';
import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpDetailsHeaderProps} from '@/shared/interfaces/followUp';
import {
  formatDurationLabel,
  getLateMinutes,
  getPriorityConfig,
  getStatusConfig,
} from '@/shared/utils/followUpUtils';
import FollowUpChip from '@/views/pages/followUps/components/FollowUpChip';

const FollowUpDetailsHeader = ({
  task,
  permissions,
  actions,
}: FollowUpDetailsHeaderProps) => {
  const {t} = useTranslation();
  const status = getStatusConfig({status: task.status});
  const lateMinutes = getLateMinutes({task});

  // "Overdue 6h" beats the plain status word while the task is late.
  const statusChip =
    task.isOverdue && status ? (
      <CustomChip
        skin='light'
        size='small'
        color='error'
        label={t('followUps.due.overdueBy', {
          duration: formatDurationLabel({minutes: lateMinutes, t}),
        })}
      />
    ) : (
      <FollowUpChip config={status} fallbackLabel={task.status} />
    );

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={t('followUps.detail.crumb')}
          crumbHref={DASHBOARD_ROUTES.followUps.all()}
          name={task.title}
          status={
            <Box className='flex items-center gap-2'>
              {statusChip}
              <FollowUpChip
                config={getPriorityConfig({priority: task.priority})}
                fallbackLabel={task.priority}
              />
            </Box>
          }
        />
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box className='flex items-center gap-2'>
          {permissions.canEdit && (
            <Button variant='outlined' onClick={actions.onEdit}>
              {t('followUps.actions.edit')}
            </Button>
          )}
          {permissions.canCancel && (
            <Button variant='outlined' color='error' onClick={actions.onCancel}>
              {t('followUps.actions.cancel')}
            </Button>
          )}
          {permissions.canComplete && (
            <Button variant='contained' onClick={actions.onComplete}>
              {t('followUps.actions.complete')}
            </Button>
          )}
          {/* PREVENT-772: reopen removed for now; uncomment to restore.
          {permissions.canReopen && (
            <Button variant='outlined' onClick={actions.onReopen}>
              {t('followUps.actions.reopen')}
            </Button>
          )} */}
        </Box>
      </TopBarSlot>
    </>
  );
};

export default FollowUpDetailsHeader;
