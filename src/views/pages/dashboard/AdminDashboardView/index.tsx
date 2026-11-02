'use client';

import {useCallback, useState} from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import DateRangeControl from '@/shared/components/common/inputs/DateRangeControl';
import AlertQueueCard from '@/shared/components/pages/dashboard/AlertQueueCard';
import DashboardStatsGrid from '@/shared/components/pages/dashboard/DashboardStatsGrid';
import FlagsRaisedChart from '@/shared/components/pages/dashboard/FlagsRaisedChart';
import RecentActivityCard from '@/shared/components/pages/dashboard/RecentActivityCard';
import SlaComplianceChart from '@/shared/components/pages/dashboard/SlaComplianceChart';
import {
  ADMIN_DASHBOARD_ACTION_STATS,
  ADMIN_DASHBOARD_GRID_SIZES,
} from '@/shared/constants/adminDashboard';
import {
  DASHBOARD_STATS_GRID_SPACING,
  STATISTICS_DEFAULT_RANGE_DAYS,
} from '@/shared/constants/dashboard';
import useAdminDashboardData from '@/shared/hooks/useAdminDashboardData';
import useTranslation from '@/shared/hooks/useTranslation';
import {StatisticsRangeParams} from '@/shared/interfaces/dashboard';
import {formatTimeOfDay, getPastDateRange} from '@/shared/utils/dateUtils';

const AdminDashboardView = () => {
  const {t} = useTranslation();

  const {statsUpdatedAt, actionValues, isLoading} = useAdminDashboardData({});

  const asOfTime = formatTimeOfDay({millis: statsUpdatedAt});

  const [trendRange, setTrendRange] = useState<StatisticsRangeParams>(() =>
    getPastDateRange({days: STATISTICS_DEFAULT_RANGE_DAYS})
  );

  const handleTrendRangeChange = useCallback(
    ({range}: {range: StatisticsRangeParams}) => setTrendRange(range),
    []
  );

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <SectionHeading
        title={t('dashboard.sections.rightNow')}
        meta={
          asOfTime && (
            <>
              {`${t('dashboard.sections.asOf')} `}
              <Typography
                component='span'
                variant='mono'
                sx={{fontSize: 'inherit'}}
              >
                {asOfTime}
              </Typography>
            </>
          )
        }
      />

      <DashboardStatsGrid
        items={ADMIN_DASHBOARD_ACTION_STATS}
        size={ADMIN_DASHBOARD_GRID_SIZES.action}
        values={actionValues}
        isLoading={isLoading}
      />

      <SectionHeading
        title={t('dashboard.sections.trends')}
        action={
          <DateRangeControl
            range={trendRange}
            onRangeChange={handleTrendRangeChange}
          />
        }
      />

      <Grid container spacing={DASHBOARD_STATS_GRID_SPACING}>
        <Grid size={ADMIN_DASHBOARD_GRID_SIZES.flagsRaised}>
          <FlagsRaisedChart range={trendRange} />
        </Grid>
        <Grid size={ADMIN_DASHBOARD_GRID_SIZES.slaCompliance}>
          <SlaComplianceChart range={trendRange} />
        </Grid>
      </Grid>

      <Grid container spacing={DASHBOARD_STATS_GRID_SPACING}>
        <Grid size={ADMIN_DASHBOARD_GRID_SIZES.alertQueue}>
          <AlertQueueCard />
        </Grid>
        <Grid size={ADMIN_DASHBOARD_GRID_SIZES.recentActivity}>
          <RecentActivityCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardView;
