'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import StatsCard from '@/shared/components/common/StatsCard';
import ReportErrorState from '@/shared/components/pages/reports/ReportErrorState';
import {
  REPORT_DELTA,
  REPORT_KPI_TILES,
  REPORT_TONE_COLORS,
} from '@/shared/constants/reports';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportOverviewSectionProps} from '@/shared/interfaces/reports';
import {
  buildDeltaLabel,
  buildKpiTileValues,
  deltaTone,
  formatReportValue,
  toneFor,
} from '@/shared/utils/reportFormat';

const ReportKpiRow = ({
  overview,
  isLoading,
  isError,
  onRetry,
}: ReportOverviewSectionProps) => {
  const {t} = useTranslation();

  if (isError)
    return (
      <Card elevation={6}>
        <ReportErrorState onRetry={onRetry} />
      </Card>
    );

  return (
    <Box className='grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5'>
      {REPORT_KPI_TILES.map((config) => {
        const title = t(config.titleKey);
        const scopeLabel = config.isLive ? t('reports.now') : undefined;

        if (isLoading || !overview)
          return (
            <StatsCard
              compact
              key={config.key}
              title={title}
              scopeLabel={scopeLabel}
              stats={<Skeleton width={SKELETON_TEXT_WIDTH.sm} />}
            />
          );

        const {value, delta, subtitleParams} = buildKpiTileValues({
          config,
          overview,
        });

        const valueTone = toneFor({value, thresholds: config.thresholds});
        const changeTone = deltaTone({delta, goodWhen: config.goodWhen});
        const deltaLabel = buildDeltaLabel({delta, format: config.format});

        return (
          <StatsCard
            compact
            key={config.key}
            title={title}
            scopeLabel={scopeLabel}
            stats={
              <Box component='span' sx={{color: REPORT_TONE_COLORS[valueTone]}}>
                {formatReportValue({value, format: config.format})}
              </Box>
            }
            delta={
              deltaLabel && (
                <Typography
                  component='span'
                  variant='small'
                  title={t('reports.kpis.deltaVsPrevious')}
                  className='tabular-nums'
                  sx={{
                    fontWeight: 700,
                    color:
                      changeTone === 'neutral'
                        ? REPORT_DELTA.neutralColor
                        : REPORT_TONE_COLORS[changeTone],
                  }}
                >
                  {t(deltaLabel.labelKey, deltaLabel.params)}
                </Typography>
              )
            }
            subtitle={t(config.subtitleKey, subtitleParams)}
          />
        );
      })}
    </Box>
  );
};

export default ReportKpiRow;
