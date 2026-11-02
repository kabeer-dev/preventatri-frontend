'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import TrendCard from '@/shared/components/pages/dashboard/TrendCard';
import {FLAGS_RAISED_TIERS} from '@/shared/constants/adminDashboard';
import {
  TREND_CHART,
  TREND_RANGE_LABEL_FORMAT,
} from '@/shared/constants/dashboard';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AdminStatsTrendsParams,
  TrendChartRangeProps,
} from '@/shared/interfaces/dashboard';
import {useQueries} from '@/shared/reactQuery/dashboard/queries';
import {formatDateRangeLabel} from '@/shared/utils/dateUtils';
import {
  buildFlagsRaisedChartData,
  buildFlagsRaisedChartOptions,
} from '@/shared/utils/trendCharts';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const FlagsRaisedChart = ({range, filters}: TrendChartRangeProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const {useFetchAdminDashboardStatsTrends} = useQueries();

  // Without filters the params stay the plain range, so the dashboard's
  // request and cache key are unchanged.
  const params: AdminStatsTrendsParams = useMemo(
    () => (filters ? {...range, ...filters} : range),
    [range, filters]
  );

  const {data, isLoading, isError} = useFetchAdminDashboardStatsTrends({
    params,
  });

  const trends = data?.trends;

  const chartData = useMemo(
    () => buildFlagsRaisedChartData({trends, theme, translate: t}),
    [trends, theme, t]
  );

  const chartOptions = useMemo(
    () => buildFlagsRaisedChartOptions({theme}),
    [theme]
  );

  const rangeLabel = formatDateRangeLabel({
    range,
    sameYearStartFormat: TREND_RANGE_LABEL_FORMAT.sameYearStart,
    fullFormat: TREND_RANGE_LABEL_FORMAT.full,
  });

  let statusMessage = null;
  if (isError) statusMessage = t('dashboard.adminDashboard.flagsRaised.error');
  else if (!trends?.labels.length)
    statusMessage = t('dashboard.adminDashboard.flagsRaised.empty');

  return (
    <TrendCard
      isLoading={isLoading}
      statusMessage={statusMessage}
      header={
        <>
          <Typography variant='bodyStrong' component='h3' className='font-bold'>
            {t('dashboard.adminDashboard.flagsRaised.title')}
          </Typography>
          <Typography variant='small' className='text-ink-subtle'>
            {t('dashboard.adminDashboard.flagsRaised.subtitle', {
              range: rangeLabel,
            })}
          </Typography>
        </>
      }
      footer={FLAGS_RAISED_TIERS.map(({level, labelKey, colorKey}) => (
        <Box key={level} className='flex items-center gap-1.5'>
          <Box
            aria-hidden
            className='rounded-xs'
            sx={{
              width: TREND_CHART.legendSwatchSize,
              height: TREND_CHART.legendSwatchSize,
              bgcolor: `customColors.${colorKey}`,
            }}
          />
          <Typography variant='small' className='text-ink-muted'>
            {t(labelKey)}
          </Typography>
        </Box>
      ))}
    >
      <Bar
        role='img'
        aria-label={t('dashboard.adminDashboard.flagsRaised.chartLabel')}
        data={chartData}
        options={chartOptions}
      />
    </TrendCard>
  );
};

export default FlagsRaisedChart;
