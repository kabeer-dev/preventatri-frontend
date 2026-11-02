'use client';

import Typography from '@mui/material/Typography';

import {useElapsedTime} from '@/shared/hooks/useElapsedTime';
import {ElapsedTimerProps} from '@/shared/interfaces/timers';

const ElapsedTimer = ({since, sx, ...typographyProps}: ElapsedTimerProps) => {
  const {formatted} = useElapsedTime({since});

  return (
    <Typography
      role='timer'
      {...typographyProps}
      sx={[
        {fontVariantNumeric: 'tabular-nums'},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {formatted}
    </Typography>
  );
};

export default ElapsedTimer;
