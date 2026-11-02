'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {radius} from '@/@core/theme/spacing';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {
  REPORT_ROLE_ROW,
  REPORT_ROLES,
  REPORT_THRESHOLDS,
  REPORT_TONE_COLORS,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {ReportOverviewSectionProps} from '@/shared/interfaces/reports';
import {
  formatReportCount,
  formatReportPercent,
  toneFor,
} from '@/shared/utils/reportFormat';

const RolePerformanceCard = ({
  overview,
  isLoading,
  isError,
  onRetry,
}: ReportOverviewSectionProps) => {
  const {t} = useTranslation();

  return (
    <ReportCard
      title={t('reports.roles.title')}
      caption={t('reports.roles.caption')}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
    >
      {overview && (
        <Box className='flex flex-col gap-3.5'>
          {REPORT_ROLES.map((config) => {
            const {pct, part, total, people} = overview.roles[config.key];

            const toneColor =
              REPORT_TONE_COLORS[
                toneFor({value: pct, thresholds: REPORT_THRESHOLDS.role})
              ];

            const fillWidth = Math.min(Math.max(pct ?? 0, 0), 100);

            return (
              <Box
                key={config.key}
                className='grid items-center gap-x-3 gap-y-1.5'
                sx={{
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr) auto',
                    sm: `minmax(0, 1fr) ${REPORT_ROLE_ROW.barWidth}px ${REPORT_ROLE_ROW.percentWidth}px`,
                  },
                }}
              >
                <Box
                  className='min-w-0'
                  sx={{gridColumn: {xs: '1 / -1', sm: 'auto'}}}
                >
                  <Box className='flex items-center gap-2'>
                    <Typography variant='bodyStrong' component='p'>
                      {t(config.labelKey)}
                    </Typography>
                    <CustomChip
                      size='small'
                      label={formatReportCount({value: people})}
                      className='tabular-nums'
                      sx={{
                        bgcolor: 'customColors.brandTint',
                        color: 'primary.main',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant='small' className='text-ink-muted'>
                    {t(config.measureKey, {part, total})}
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
                      width: `${fillWidth}%`,
                      borderRadius: `${radius.full}px`,
                      bgcolor: toneColor,
                    }}
                  />
                </Box>

                <Typography
                  variant='bodyStrong'
                  className='text-right tabular-nums'
                  sx={{color: toneColor}}
                >
                  {formatReportPercent({value: pct})}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </ReportCard>
  );
};

export default RolePerformanceCard;
