'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import ReportErrorState from '@/shared/components/pages/reports/ReportErrorState';
import {REPORT_CARD} from '@/shared/constants/reports';
import {ReportCardProps} from '@/shared/interfaces/reports';

const ReportCard = ({
  title,
  caption,
  isLoading,
  isError,
  onRetry,
  children,
}: ReportCardProps) => {
  const showContent = !isLoading && !isError;

  return (
    <Card elevation={6} className='flex h-full flex-col gap-3 px-4 py-3.5'>
      <Box className='flex flex-wrap items-baseline gap-2'>
        <Typography variant='bodyStrong' component='h3' className='font-bold'>
          {title}
        </Typography>
        {caption && (
          <Typography variant='small' className='text-ink-subtle'>
            {caption}
          </Typography>
        )}
      </Box>

      {isLoading && (
        <Skeleton variant='rounded' height={REPORT_CARD.skeletonHeight} />
      )}

      {!isLoading && isError && <ReportErrorState onRetry={onRetry} />}

      {showContent && children}
    </Card>
  );
};

export default ReportCard;
