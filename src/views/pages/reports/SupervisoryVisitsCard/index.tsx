'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import MiniStat from '@/shared/components/pages/reports/MiniStat';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {TREND_CHART} from '@/shared/constants/dashboard';
import {
  REPORT_SEGMENTED_BAR,
  REPORT_THRESHOLDS,
  REPORT_VISIT_STATUS_MIX,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportSectionProps} from '@/shared/interfaces/reports';
import {reportQueries} from '@/shared/reactQuery';
import {
  formatReportCount,
  formatReportDuration,
  formatReportPercent,
  toneFor,
} from '@/shared/utils/reportFormat';

const SupervisoryVisitsCard = ({params}: ReportSectionProps) => {
  const {t} = useTranslation();
  const {useFetchReportWorkItems} = reportQueries();

  const {data, isLoading, isError, refetch} = useFetchReportWorkItems({
    params,
  });

  const visits = data?.visits;

  const statusParts = (visits?.statusMix ?? []).map(({status, count}) => ({
    status,
    count,
    label: t(REPORT_VISIT_STATUS_MIX[status].labelKey),
    color: REPORT_VISIT_STATUS_MIX[status].color,
  }));

  const statusTotal = statusParts.reduce((sum, {count}) => sum + count, 0);

  const statusSummary = statusParts
    .map(({label, count}) => `${label} ${count}`)
    .join(', ');

  return (
    <ReportCard
      title={t('reports.visits.title')}
      caption={t('reports.visits.caption')}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    >
      {visits && (
        <Box className='flex flex-col gap-4'>
          <Box>
            <Box className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              <MiniStat
                value={formatReportCount({value: visits.scheduled})}
                label={t('reports.visits.scheduled')}
              />
              <MiniStat
                value={formatReportPercent({value: visits.filedOnTimePct})}
                label={t('reports.visits.filedOnTime')}
                tone={toneFor({
                  value: visits.filedOnTimePct,
                  thresholds: REPORT_THRESHOLDS.role,
                })}
              />
              <MiniStat
                value={formatReportDuration({
                  seconds: visits.medianReviewSeconds,
                })}
                label={t('reports.visits.medianReview')}
              />
              <MiniStat
                isLive
                value={formatReportCount({value: visits.overdueNow})}
                label={t('reports.visits.overdue')}
                tone={visits.overdueNow > 0 ? 'poor' : 'neutral'}
              />
            </Box>

            <Box
              role='img'
              aria-label={t('reports.visits.statusMixLabel', {
                summary: statusSummary,
              })}
              className='flex overflow-hidden'
              sx={{
                mt: `${REPORT_SEGMENTED_BAR.topGap}px`,
                height: REPORT_SEGMENTED_BAR.height,
                borderRadius: `${radius.full}px`,
                bgcolor: 'customColors.segmentTrack',
              }}
            >
              {statusTotal > 0 &&
                statusParts.map(({status, count, color}) => (
                  <Box
                    key={status}
                    sx={{
                      width: `${(count / statusTotal) * 100}%`,
                      bgcolor: color,
                    }}
                  />
                ))}
            </Box>
          </Box>

          <Box className='grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2'>
            {statusParts.map(({status, count, label, color}) => (
              <Box key={status} className='flex items-center gap-1.5'>
                <Box
                  aria-hidden
                  className='rounded-xs shrink-0'
                  sx={{
                    width: TREND_CHART.legendSwatchSize,
                    height: TREND_CHART.legendSwatchSize,
                    bgcolor: color,
                  }}
                />
                <Typography variant='small' className='text-ink-muted'>
                  {label}
                </Typography>
                <Typography
                  variant='small'
                  className='ml-auto font-bold tabular-nums'
                >
                  {formatReportCount({value: count})}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className='border-rule grid grid-cols-1 gap-3 border-t pt-3 sm:grid-cols-2'>
            <MiniStat
              value={t('reports.visits.concernsValue', {
                count: visits.concernsNoted,
                filed: visits.filed,
              })}
              label={t('reports.visits.concerns')}
            />
            <MiniStat
              value={formatReportCount({value: visits.correctionRequested})}
              label={t('reports.visits.corrections')}
            />
          </Box>
        </Box>
      )}
    </ReportCard>
  );
};

export default SupervisoryVisitsCard;
