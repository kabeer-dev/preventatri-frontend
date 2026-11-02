'use client';

import {useMemo} from 'react';

import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  Tooltip,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

import MiniStat from '@/shared/components/pages/reports/MiniStat';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {TREND_CHART} from '@/shared/constants/dashboard';
import {
  REPORT_FOLLOW_UP_CHART,
  REPORT_THRESHOLDS,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportSectionProps} from '@/shared/interfaces/reports';
import {reportQueries} from '@/shared/reactQuery';
import {formatDate} from '@/shared/utils/dateUtils';
import {
  formatReportCount,
  formatReportPercent,
  toneFor,
} from '@/shared/utils/reportFormat';
import {buildFlagsRaisedChartOptions} from '@/shared/utils/trendCharts';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const FollowUpTasksCard = ({params}: ReportSectionProps) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {useFetchReportWorkItems} = reportQueries();

  const {data, isLoading, isError, refetch} = useFetchReportWorkItems({
    params,
  });

  const followUps = data?.followUps;

  const series = useMemo(
    () => [
      {
        key: 'created',
        label: t('reports.followUps.created'),
        color: theme.palette.customColors.brandMuted,
        values: followUps?.trend.created ?? [],
      },
      {
        key: 'completed',
        label: t('reports.followUps.completed'),
        color: theme.palette.primary.main,
        values: followUps?.trend.completed ?? [],
      },
    ],
    [followUps, theme, t]
  );

  const chartData = useMemo(
    (): ChartData<'bar'> => ({
      labels: (followUps?.trend.buckets ?? []).map(({key}) =>
        formatDate({
          date: key,
          format: REPORT_FOLLOW_UP_CHART.bucketLabelFormat,
        })
      ),
      datasets: series.map(({label, color, values}) => ({
        label,
        data: values,
        backgroundColor: color,
        borderRadius: TREND_CHART.barRadius,
        categoryPercentage: TREND_CHART.barCategoryPercentage,
      })),
    }),
    [followUps, series]
  );

  // Same look as Flags raised, but grouped bars and labels already formatted.
  const chartOptions = useMemo((): ChartOptions<'bar'> => {
    const base = buildFlagsRaisedChartOptions({theme});

    return {
      ...base,
      scales: {
        x: {display: false},
        y: {display: false, beginAtZero: true},
      },
      plugins: {
        ...base.plugins,
        tooltip: {
          ...base.plugins?.tooltip,
          itemSort: undefined,
          callbacks: {title: (items) => items[0]?.label ?? ''},
        },
      },
    };
  }, [theme]);

  const overdue = followUps?.overdueNow ?? 0;

  return (
    <ReportCard
      title={t('reports.followUps.title')}
      caption={t('reports.followUps.caption')}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    >
      {followUps && (
        <Box className='flex flex-col'>
          <Box className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <MiniStat
              value={formatReportCount({value: followUps.created})}
              label={t('reports.followUps.created')}
            />
            <MiniStat
              value={formatReportCount({value: followUps.completed})}
              label={t('reports.followUps.completed')}
            />
            <MiniStat
              value={formatReportPercent({
                value: followUps.completedOnTimePct,
              })}
              label={t('reports.followUps.onTime')}
              tone={toneFor({
                value: followUps.completedOnTimePct,
                thresholds: REPORT_THRESHOLDS.role,
              })}
            />
            <MiniStat
              isLive
              value={formatReportCount({value: overdue})}
              label={t('reports.followUps.overdue')}
              tone={overdue > 0 ? 'poor' : 'neutral'}
            />
          </Box>

          <Box className='relative' sx={{height: TREND_CHART.height}}>
            <Bar
              role='img'
              aria-label={t('reports.followUps.chartLabel')}
              data={chartData}
              options={chartOptions}
            />
          </Box>

          <Box className='border-rule flex flex-wrap items-center gap-3 border-t pt-3'>
            {series.map(({key, label, color}) => (
              <Box key={key} className='flex items-center gap-1.5'>
                <Box
                  aria-hidden
                  className='rounded-xs'
                  sx={{
                    width: TREND_CHART.legendSwatchSize,
                    height: TREND_CHART.legendSwatchSize,
                    bgcolor: color,
                  }}
                />
                <Typography variant='small' className='text-ink-muted'>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </ReportCard>
  );
};

export default FollowUpTasksCard;
