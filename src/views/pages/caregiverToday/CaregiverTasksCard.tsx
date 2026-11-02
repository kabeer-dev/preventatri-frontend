'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import PanelCard from '@/shared/components/common/cards/PanelCard';
import Link from '@/shared/components/common/localeLink';
import {PANEL_CARD} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaregiverTasksCardProps,
  FollowUpTask,
} from '@/shared/interfaces/followUp';
import {
  formatDueDateTime,
  getDueRelativeLabel,
  getLateMinutes,
  getStatusConfig,
} from '@/shared/utils/followUpUtils';
import FollowUpChip from '@/views/pages/followUps/components/FollowUpChip';

const SKELETON_ROWS = 3;

const CaregiverTaskRow = ({task}: {task: FollowUpTask}) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const isLate = task.isOverdue || getLateMinutes({task}) > 0;

  return (
    <Box
      component={Link}
      href={DASHBOARD_ROUTES.followUps.single({id: task.id})}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: 2.5,
        alignItems: 'center',
        px: PANEL_CARD.paddingX,
        py: 2.5,
        borderTop: '1px solid',
        borderColor: 'customColors.rule',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <Box sx={{minWidth: 0}}>
        <Typography variant='bodyStrong' noWrap sx={{display: 'block'}}>
          {task.title}
        </Typography>
        <Typography
          variant='small'
          noWrap
          sx={{color: isLate ? 'error.main' : 'text.disabled'}}
        >
          {formatDueDateTime({dueAt: task.dueAt, zone})} ·{' '}
          {getDueRelativeLabel({task, t, zone})}
        </Typography>
      </Box>
      <FollowUpChip config={getStatusConfig({status: task.status})} />
    </Box>
  );
};

// The caregiver has no sidebar, so her open tasks live on Today.
const CaregiverTasksCard = ({
  tasks,
  isLoading = false,
}: CaregiverTasksCardProps) => {
  const {t} = useTranslation();

  return (
    <PanelCard
      title={t('followUps.caregiverCard.title')}
      subtitle={t('followUps.caregiverCard.subtitle')}
      bodyPadding={0}
    >
      {isLoading &&
        Array.from({length: SKELETON_ROWS}).map((_, index) => (
          <Skeleton key={index} height={48} sx={{mx: PANEL_CARD.paddingX}} />
        ))}

      {!isLoading && tasks.length === 0 && (
        <Typography
          variant='small'
          sx={{
            color: 'text.secondary',
            display: 'block',
            p: PANEL_CARD.paddingX,
          }}
        >
          {t('followUps.caregiverCard.empty')}
        </Typography>
      )}

      {tasks.map((task) => (
        <CaregiverTaskRow key={task.id} task={task} />
      ))}
    </PanelCard>
  );
};

export default CaregiverTasksCard;
