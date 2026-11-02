'use client';

import Box from '@mui/material/Box';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import CaseManagerChecklistTasksCard from '@/shared/components/pages/dashboard/CaseManagerChecklistTasksCard';
import DashboardStatsGrid from '@/shared/components/pages/dashboard/DashboardStatsGrid';
import {
  CASE_MANAGER_DASHBOARD_STATS,
  CASE_MANAGER_DASHBOARD_STATS_GRID_SIZE,
} from '@/shared/constants/caseManagerDashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {caseManagerQueries} from '@/shared/reactQuery';

const CaseManagerDashboardView = () => {
  const {t} = useTranslation();
  const {useFetchCaseManagerDashboard} = caseManagerQueries();
  const {data, isLoading, isError} = useFetchCaseManagerDashboard({});

  const stats = data?.stats;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <SectionHeading title={t('dashboard.sections.rightNow')} />

      <DashboardStatsGrid
        items={CASE_MANAGER_DASHBOARD_STATS}
        size={CASE_MANAGER_DASHBOARD_STATS_GRID_SIZE}
        values={
          stats && {
            tasksAssignedToMe: stats.tasksAssignedToMe.total,
            myPatients: stats.myPatients,
            assessmentRate: stats.assessmentRate,
          }
        }
        subtitleParams={
          stats && {
            tasksAssignedToMe: {
              followUps: stats.tasksAssignedToMe.followUps,
              supervisoryVisits: stats.tasksAssignedToMe.supervisoryVisits,
            },
            assessmentRate: stats.assessmentRateCounts,
          }
        }
        isLoading={isLoading}
      />

      {/* PanelCard allows shrinking (minHeight 0 + overflow hidden); in this flex column that clips the last rows. */}
      <Box sx={{flex: 'none'}}>
        <CaseManagerChecklistTasksCard
          items={data?.checklistTasks ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </Box>
    </Box>
  );
};

export default CaseManagerDashboardView;
