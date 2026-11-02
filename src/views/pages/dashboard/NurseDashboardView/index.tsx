'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import DashboardStatsGrid from '@/shared/components/pages/dashboard/DashboardStatsGrid';
import NurseAssessmentsCard from '@/shared/components/pages/dashboard/NurseAssessmentsCard';
import NurseMyDayCard from '@/shared/components/pages/dashboard/NurseMyDayCard';
import {DASHBOARD_STATS_GRID_SPACING} from '@/shared/constants/dashboard';
import {
  NURSE_DASHBOARD_GRID_SIZES,
  NURSE_DASHBOARD_STATS,
} from '@/shared/constants/nurseDashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {nurseQueries} from '@/shared/reactQuery';
import NeedsMeNowTable from '@/views/pages/dashboard/NeedsMeNowTable';

const NurseDashboardView = () => {
  const {t} = useTranslation();
  const {useFetchNurseDashboard} = nurseQueries();
  const {data, isLoading, isError} = useFetchNurseDashboard({});

  const stats = data?.stats;

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <SectionHeading title={t('dashboard.sections.rightNow')} />

      <DashboardStatsGrid
        items={NURSE_DASHBOARD_STATS}
        size={NURSE_DASHBOARD_GRID_SIZES.stats}
        values={
          stats && {
            openAlerts: stats.openAlerts.total,
            dueToday: stats.dueToday.total,
            myPatients: stats.myPatients,
          }
        }
        subtitleParams={
          stats && {
            openAlerts: {
              red: stats.openAlerts.red,
              yellow: stats.openAlerts.yellow,
            },
            dueToday: {
              followUps: stats.dueToday.followUps,
              supervisoryVisits: stats.dueToday.supervisoryVisits,
            },
          }
        }
        isLoading={isLoading}
      />

      <Grid container spacing={DASHBOARD_STATS_GRID_SPACING}>
        <Grid size={NURSE_DASHBOARD_GRID_SIZES.main}>
          <NeedsMeNowTable />
        </Grid>
        <Grid size={NURSE_DASHBOARD_GRID_SIZES.side}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
            <NurseMyDayCard
              items={data?.myDay ?? []}
              isLoading={isLoading}
              isError={isError}
            />
            <NurseAssessmentsCard
              counts={data?.assessmentsSinceYesterday}
              isLoading={isLoading}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NurseDashboardView;
