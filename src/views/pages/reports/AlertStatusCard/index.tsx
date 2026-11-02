'use client';

import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {ArcElement, Chart as ChartJS, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

import {radius} from '@/@core/theme/spacing';
import MiniStat from '@/shared/components/pages/reports/MiniStat';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {
  REPORT_ALERT_STATUS_CHART,
  REPORT_ALERT_STATUSES,
  REPORT_ROLE_ROW,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportOverviewSectionProps} from '@/shared/interfaces/reports';
import {
  formatReportCount,
  formatReportDuration,
  formatReportPercent,
} from '@/shared/utils/reportFormat';
import {buildTooltipStyle} from '@/shared/utils/trendCharts';

ChartJS.register(ArcElement, Tooltip);

const AlertStatusCard = ({
  overview,
  isLoading,
  isError,
  onRetry,
}: ReportOverviewSectionProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const counts = REPORT_ALERT_STATUSES.map(
    ({key}) => overview?.alertStatus[key] ?? 0
  );

  const total = counts.reduce((sum, count) => sum + count, 0);

  // Voided alerts need no resolution, so they stay out of the rate.
  const active = total - (overview?.alertStatus.voided ?? 0);

  const resolvedPct = active
    ? ((overview?.alertStatus.resolved ?? 0) / active) * 100
    : null;

  return (
    <ReportCard
      title={t('reports.alertStatus.title')}
      caption={t('reports.alertStatus.caption')}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
    >
      {overview && !total && (
        <Typography variant='small' className='text-ink-muted'>
          {t('reports.alertStatus.empty')}
        </Typography>
      )}

      {overview && Boolean(total) && (
        <Box className='flex flex-col gap-3'>
          <Box className='flex flex-col items-center gap-5 sm:flex-row'>
            <Box
              className='relative shrink-0'
              sx={{
                width: REPORT_ALERT_STATUS_CHART.size,
                height: REPORT_ALERT_STATUS_CHART.size,
              }}
            >
              {/* Drawn first so the chart tooltip sits above the total. */}
              <Box className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <Typography variant='h3' component='p' className='tabular-nums'>
                  {formatReportCount({value: total})}
                </Typography>
                <Typography variant='small' className='text-ink-muted'>
                  {t('reports.alertStatus.total', {count: total})}
                </Typography>
              </Box>

              <Doughnut
                className='relative'
                role='img'
                aria-label={t('reports.alertStatus.chartLabel')}
                data={{
                  labels: REPORT_ALERT_STATUSES.map(({labelKey}) =>
                    t(labelKey)
                  ),
                  datasets: [
                    {
                      data: counts,
                      backgroundColor: REPORT_ALERT_STATUSES.map(
                        ({color}) => theme.palette.customColors[color]
                      ),
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: REPORT_ALERT_STATUS_CHART.cutout,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {display: false},
                    tooltip: buildTooltipStyle({theme}),
                  },
                }}
              />
            </Box>

            <Box
              component='ul'
              className='m-0 grid w-full min-w-0 flex-1 list-none items-center gap-x-3 gap-y-3.5 p-0'
              sx={{
                gridTemplateColumns: `auto minmax(0, 1fr) auto ${REPORT_ROLE_ROW.percentWidth}px`,
              }}
            >
              {REPORT_ALERT_STATUSES.map(({key, labelKey, color}, index) => {
                const share = (counts[index] / total) * 100;

                return (
                  <Box component='li' key={key} className='contents'>
                    <Box className='flex items-center gap-2'>
                      <Box
                        aria-hidden
                        className='size-2.5 shrink-0 rounded-full'
                        sx={{bgcolor: `customColors.${color}`}}
                      />
                      <Typography variant='small' className='text-ink-muted'>
                        {t(labelKey)}
                      </Typography>
                    </Box>

                    <Box
                      aria-hidden
                      className='overflow-hidden'
                      sx={{
                        height: REPORT_ROLE_ROW.barHeight,
                        borderRadius: `${radius.full}px`,
                        bgcolor: 'customColors.segmentTrack',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${share}%`,
                          borderRadius: `${radius.full}px`,
                          bgcolor: `customColors.${color}`,
                        }}
                      />
                    </Box>

                    <Typography
                      variant='bodyStrong'
                      className='text-right tabular-nums'
                    >
                      {formatReportCount({value: counts[index]})}
                    </Typography>
                    <Typography
                      variant='small'
                      className='text-ink-muted text-right tabular-nums'
                    >
                      {formatReportPercent({value: share})}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box className='border-rule grid grid-cols-2 gap-3 border-t pt-3 sm:grid-cols-4'>
            <MiniStat
              value={formatReportCount({value: overview.kpiDetails.red})}
              label={t('reports.alertStatus.red')}
            />
            <MiniStat
              value={formatReportCount({value: overview.kpiDetails.yellow})}
              label={t('reports.alertStatus.yellow')}
            />
            <MiniStat
              value={formatReportPercent({value: resolvedPct})}
              label={t('reports.alertStatus.resolvedRate')}
            />
            <MiniStat
              value={formatReportDuration({
                seconds: overview.kpis.medianResolveSeconds.value,
              })}
              label={t('reports.kpis.medianResolve')}
            />
          </Box>
        </Box>
      )}
    </ReportCard>
  );
};

export default AlertStatusCard;
