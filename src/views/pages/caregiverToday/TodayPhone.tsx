'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import CaregiverChecklistTable from '@/shared/components/caregiver/CaregiverChecklistTable';
import RaiseRedFlagAction from '@/shared/components/caregiver/RaiseRedFlagAction';
import {useCaregiverFollowUpTasks} from '@/shared/hooks/useCaregiverFollowUpTasks';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverTodayViewProps} from '@/shared/interfaces/caregiverChecklist';

import CaregiverTasksCard from './CaregiverTasksCard';
import LateList from './LateList';

const TodayPhone = ({
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

  return (
    <Box>
      <Box
        sx={{
          mx: `-${layout.phoneGutter}px`,
          mt: `-${layout.pageGutterY}px`,
          px: 6,
          pt: 6,
          pb: 6,
          backgroundColor: 'customColors.shell',
          color: 'common.white',
        }}
      >
        <Typography
          sx={{fontSize: '0.8125rem', color: 'customColors.shellMuted'}}
        >
          {dateLabel}
        </Typography>

        <Typography variant='h1' sx={{mt: 3}}>
          {greeting}
        </Typography>

        <Box sx={{display: 'flex', gap: 5, mt: 3, fontSize: '0.8125rem'}}>
          {countEntries.map(({key, value, label, isCritical}) => (
            <Typography
              key={key}
              component='span'
              sx={{color: 'customColors.shellText'}}
            >
              <Box
                component='span'
                sx={{
                  fontWeight: 700,
                  color: isCritical
                    ? 'customColors.shellDangerText'
                    : 'common.white',
                }}
              >
                {isLoading ? (
                  <Skeleton
                    component='span'
                    width={12}
                    sx={{
                      display: 'inline-block',
                      bgcolor: 'customColors.shellActive',
                    }}
                  />
                ) : (
                  value
                )}
              </Box>{' '}
              {label}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box sx={{pt: 5, display: 'flex', flexDirection: 'column', gap: 3}}>
        <LateList late={late} />
      </Box>

      <Box sx={{pt: 5.5}}>
        <CaregiverTasksCard tasks={tasks} isLoading={isTasksLoading} />
      </Box>

      <Box sx={{pt: 5.5}}>
        <CaregiverChecklistTable
          showPatient
          linkRows
          rows={dueToday}
          isLoading={isLoading}
          title={t('caregiverPortal.today.upNext.title')}
          emptyLabel={t('caregiverPortal.today.upNext.empty')}
        />
      </Box>

      <Box sx={{pt: 5}}>
        <RaiseRedFlagAction />
      </Box>

      <Box sx={{pt: 5.5}}>
        <CaregiverChecklistTable
          showPatient
          linkRows
          rows={sentToday}
          isLoading={isLoading}
          title={t('caregiverPortal.today.doneToday.title')}
          emptyLabel={t('caregiverPortal.today.doneToday.empty')}
        />
      </Box>
    </Box>
  );
};

export default TodayPhone;
