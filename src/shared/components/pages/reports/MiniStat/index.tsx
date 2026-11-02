'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import NowTag from '@/shared/components/common/NowTag';
import {REPORT_TONE_COLORS} from '@/shared/constants/reports';
import {MiniStatProps} from '@/shared/interfaces/reports';

const MiniStat = ({value, label, tone = 'neutral', isLive}: MiniStatProps) => (
  <Box className='flex min-w-0 flex-col gap-0.5'>
    <Typography
      variant='h5'
      component='p'
      className='font-bold tabular-nums'
      sx={{color: REPORT_TONE_COLORS[tone]}}
    >
      {value}
    </Typography>
    <Box className='flex flex-wrap items-center gap-1.5'>
      <Typography variant='small' className='text-ink-muted'>
        {label}
      </Typography>
      {isLive && <NowTag />}
    </Box>
  </Box>
);

export default MiniStat;
