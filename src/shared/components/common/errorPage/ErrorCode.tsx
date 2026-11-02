import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SignalPulse from '@/shared/assets/icons/signalPulse.svg';
import {ErrorCodeProps} from '@/shared/interfaces/common';
import {cn} from '@/shared/utils/tailwindUtils';

export default function ErrorCode({code, className}: ErrorCodeProps) {
  return (
    <Typography
      variant='errorCode'
      component='div'
      aria-hidden={!code}
      className={cn(
        'text-brand-edge grid w-full grid-cols-[1fr_auto_1fr] items-center',
        className
      )}
    >
      <Box aria-hidden className='flex min-w-0 items-center overflow-hidden'>
        <span className='h-0.5 min-w-0 flex-1 bg-current' />
        <SignalPulse className='size-[0.6em] shrink-0' />
        <span className='h-0.5 w-[0.2em] shrink-0 bg-current' />
      </Box>

      {code ? <span className='text-brand px-[0.2em]'>{code}</span> : <span />}

      <span aria-hidden className='h-0.5 bg-current' />
    </Typography>
  );
}
