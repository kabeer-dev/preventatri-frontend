'use client';

import {useMemo} from 'react';

import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

import TrendCard from '@/shared/components/pages/dashboard/TrendCard';
import {
  DASHBOARD_STAT_FORMATS,
  TREND_RANGE_LABEL_FORMAT,
} from '@/shared/constants/dashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AdminStatsTrendsParams,
  TrendChartRangeProps,
} from '@/shared/interfaces/dashboard';
import {useQueries} from '@/shared/reactQuery/dashboard/queries';
import {formatStatValue} from '@/shared/utils/dashboardStats';
import {formatDateRangeLabel} from '@/shared/utils/dateUtils';
import {
  buildSlaComplianceChartData,
  buildSlaComplianceChartOptions,
  hasSlaComplianceSeries,
} from '@/shared/utils/trendCharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

const SlaComplianceChart = ({range, filters}: TrendChartRangeProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const {useFetchAdminDashboardStatsTrends} = useQueries();

  // Built like the Flags raised chart's, so both cards share one request.
  const params: AdminStatsTrendsParams = useMemo(
    () => (filters ? {...range, ...filters} : range),
    [range, filters]
  );

  const {data, isLoading, isError} = useFetchAdminDashboardStatsTrends({
    params,
  });

  const trends = data?.trends;

  const chartLabel = t('dashboard.adminDashboard.slaCompliance.chartLabel');

  const chartData = useMemo(
    () => buildSlaComplianceChartData({trends, theme, label: chartLabel}),
    [trends, theme, chartLabel]
  );

  const noResolutionsLabel = t(
    'dashboard.adminDashboard.slaCompliance.noResolutions'
  );

  const chartOptions = useMemo(
    () => buildSlaComplianceChartOptions({trends, theme, noResolutionsLabel}),
    [trends, theme, noResolutionsLabel]
  );

  const rangeLabel = formatDateRangeLabel({
    range,
    sameYearStartFormat: TREND_RANGE_LABEL_FORMAT.sameYearStart,
    fullFormat: TREND_RANGE_LABEL_FORMAT.full,
  });

  let statusMessage = null;
  if (isError)
    statusMessage = t('dashboard.adminDashboard.slaCompliance.error');
  else if (!hasSlaComplianceSeries({trends}))
    statusMessage = t('dashboard.adminDashboard.slaCompliance.noDailyData');

  return (
    <TrendCard
      isLoading={isLoading}
      statusMessage={statusMessage}
      header={
        <>
          <Typography variant='bodyStrong' component='h3' className='font-bold'>
            {t('dashboard.adminDashboard.slaCompliance.title')}
          </Typography>
          <Typography
            variant='bodyStrong'
            component='span'
            className='text-brand font-mono font-medium'
          >
            {formatStatValue({
              value: trends?.slaCompliance.pct,
              format: DASHBOARD_STAT_FORMATS.PERCENT,
            })}
          </Typography>
        </>
      }
      footer={
        <Typography
          variant='small'
          className='bg-rule-strong text-ink-muted rounded-full px-2 py-0.5 font-semibold'
        >
          {rangeLabel}
        </Typography>
      }
    >
      <Line
        role='img'
        aria-label={chartLabel}
        data={chartData}
        options={chartOptions}
      />
    </TrendCard>
  );
};

export default SlaComplianceChart;
