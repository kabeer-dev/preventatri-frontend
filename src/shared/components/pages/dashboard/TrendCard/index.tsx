import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import {TREND_CHART} from '@/shared/constants/dashboard';
import {TrendCardProps} from '@/shared/interfaces/dashboard';

const TrendCard = ({
  header,
  footer,
  isLoading,
  statusMessage,
  children,
}: TrendCardProps) => (
  <Card elevation={6} className='flex h-full flex-col px-4 py-3.5'>
    <Box className='flex flex-wrap items-baseline gap-2'>{header}</Box>

    <Box className='relative' sx={{height: TREND_CHART.height}}>
      {isLoading && <Skeleton variant='rounded' height={TREND_CHART.height} />}

      {!isLoading && statusMessage && (
        <Box className='flex h-full items-center justify-center'>
          <Typography variant='small' className='text-ink-subtle'>
            {statusMessage}
          </Typography>
        </Box>
      )}

      {!isLoading && !statusMessage && children}
    </Box>

    <Box className='border-rule flex flex-wrap items-center gap-3 border-t pt-3'>
      {footer}
    </Box>
  </Card>
);

export default TrendCard;
