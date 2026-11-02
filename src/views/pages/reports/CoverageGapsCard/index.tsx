'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import ReportCard from '@/shared/components/pages/reports/ReportCard';
import {
  REPORT_COVERAGE_GAPS,
  REPORT_COVERAGE_TILE,
} from '@/shared/constants/reports';
import useTranslation from '@/shared/hooks/useTranslation';
import {CoverageGapsCardProps} from '@/shared/interfaces/reports';
import {reportQueries} from '@/shared/reactQuery';
import {formatReportCount} from '@/shared/utils/reportFormat';

const CoverageGapsCard = ({params}: CoverageGapsCardProps) => {
  const {t} = useTranslation();
  const {useFetchReportCoverage} = reportQueries();

  const {data, isLoading, isError, refetch} = useFetchReportCoverage({params});

  const tiles = REPORT_COVERAGE_GAPS.flatMap((config) => {
    const count = data?.gaps[config.key] ?? null;

    return count === null ? [] : [{...config, count}];
  });

  return (
    <ReportCard
      title={t('reports.coverage.title')}
      caption={t('reports.coverage.caption')}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    >
      <Box className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {tiles.map(({key, titleKey, reasonKey, count}) => (
          <Box
            key={key}
            className='flex items-center gap-3 px-3.5 py-3'
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: `${radius.md}px`,
            }}
          >
            <Typography
              component='p'
              className='shrink-0 text-center font-bold tabular-nums'
              sx={{
                minWidth: REPORT_COVERAGE_TILE.countMinWidth,
                fontSize: REPORT_COVERAGE_TILE.countFontSize,
                lineHeight: 1.1,
                color: count > 0 ? 'error.main' : 'success.main',
              }}
            >
              {formatReportCount({value: count})}
            </Typography>
            <Box className='min-w-0'>
              <Typography variant='bodyStrong' component='p'>
                {t(titleKey)}
              </Typography>
              <Typography variant='small' className='text-ink-muted'>
                {t(reasonKey)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </ReportCard>
  );
};

export default CoverageGapsCard;
