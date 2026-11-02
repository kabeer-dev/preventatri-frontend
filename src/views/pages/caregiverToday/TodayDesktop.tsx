'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import CaregiverChecklistTable from '@/shared/components/caregiver/CaregiverChecklistTable';
import PageHeading from '@/shared/components/common/headers/PageHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {useCaregiverFollowUpTasks} from '@/shared/hooks/useCaregiverFollowUpTasks';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverTodayViewProps} from '@/shared/interfaces/caregiverChecklist';

import CaregiverTasksCard from './CaregiverTasksCard';
import LateList from './LateList';

const TodayDesktop = ({
  greeting,
  dateLabel,
  countEntries,
  late,
  dueToday,
  sentToday,
  isLoading,
}: CaregiverTodayViewProps) => {
  const {t} = useTranslation();
  const {tasks, isLoading: isTasksLoading} = useCaregiverFollowUpTasks();

  // Late checklists have their own cards above, so the table carries what is
  // still due today and what she has already sent.
  const rows = useMemo(
    () => [...dueToday, ...sentToday],
    [dueToday, sentToday]
  );

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
      <TopBarSlot side='left'>
        <PageHeading crumb={dateLabel} title={greeting} />
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box sx={{display: 'flex', alignItems: 'baseline', gap: 4, mr: 2}}>
          {countEntries.map(({key, value, label, isCritical}) => (
            <Typography
              key={key}
              sx={{fontSize: '0.8125rem', color: 'text.secondary'}}
            >
              <Box
                component='span'
                sx={{
                  fontWeight: 700,
                  color: isCritical ? 'error.main' : 'text.primary',
                }}
              >
                {isLoading ? (
                  <Skeleton
                    component='span'
                    width={12}
                    sx={{display: 'inline-block'}}
                  />
                ) : (
                  value
                )}
              </Box>{' '}
              {label}
            </Typography>
          ))}
        </Box>
      </TopBarSlot>

      <LateList late={late} inline />

      {/* The card fills its parent's height, which in this column would take
          the whole page and squeeze the late cards above it. */}
      <Box>
        <CaregiverTasksCard tasks={tasks} isLoading={isTasksLoading} />
      </Box>

      <CaregiverChecklistTable
        showPatient
        rows={rows}
        isLoading={isLoading}
        title={t('caregiverPortal.today.upNext.title')}
        subtitle={t('caregiverPortal.today.upNext.subtitle')}
        emptyLabel={t('caregiverPortal.today.allClear')}
      />
    </Box>
  );
};

export default TodayDesktop;
