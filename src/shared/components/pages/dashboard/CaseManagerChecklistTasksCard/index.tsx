'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import PanelCard from '@/shared/components/common/cards/PanelCard';
import {PANEL_CARD} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseManagerChecklistTasksCardProps} from '@/shared/interfaces/caseManager';

import ChecklistTaskRow, {CHECKLIST_TASK_GRID_SX} from './ChecklistTaskRow';

const CHECKLIST_SKELETON_ROWS = 5;

const COLUMN_KEYS = ['due', 'checklist', 'patient', 'type', 'status'];

const CaseManagerChecklistTasksCard = ({
  items,
  isLoading,
  isError,
}: CaseManagerChecklistTasksCardProps) => {
  const {t} = useTranslation();

  const isEmpty = !isLoading && items.length === 0;

  return (
    <PanelCard
      title={t('dashboard.caseManagerDashboard.checklistTasks.title')}
      subtitle={t('dashboard.caseManagerDashboard.checklistTasks.subtitle')}
      actionLabel={t('dashboard.caseManagerDashboard.checklistTasks.action')}
      actionHref={DASHBOARD_ROUTES.followUps.all()}
      bodyPadding={0}
    >
      {/* PanelCard hides overflow, so scroll here to keep every column reachable on narrow screens. */}
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={Object.assign({}, CHECKLIST_TASK_GRID_SX, {py: 2})}>
          {COLUMN_KEYS.map((key) => (
            <Typography
              key={key}
              variant='overline'
              sx={{color: 'text.disabled'}}
            >
              {t(
                `dashboard.caseManagerDashboard.checklistTasks.columns.${key}`
              )}
            </Typography>
          ))}
        </Box>

        {items.map((item) => (
          <ChecklistTaskRow key={item.id} item={item} />
        ))}
      </Box>

      {isLoading &&
        Array.from({length: CHECKLIST_SKELETON_ROWS}).map((_, index) => (
          <Skeleton key={index} height={48} sx={{mx: PANEL_CARD.paddingX}} />
        ))}

      {isEmpty && (
        <Typography
          variant='small'
          sx={{
            color: 'text.secondary',
            display: 'block',
            p: PANEL_CARD.paddingX,
          }}
        >
          {t(
            isError
              ? 'dashboard.caseManagerDashboard.checklistTasks.error'
              : 'dashboard.caseManagerDashboard.checklistTasks.empty'
          )}
        </Typography>
      )}
    </PanelCard>
  );
};

export default CaseManagerChecklistTasksCard;
