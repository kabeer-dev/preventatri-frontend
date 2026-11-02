'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {SectionHeadingProps} from '@/shared/interfaces/layout';
import {cn} from '@/shared/utils/tailwindUtils';

const SectionHeading = ({title, meta, action}: SectionHeadingProps) => (
  <Box
    className={cn(
      'flex flex-wrap gap-3',
      action ? 'items-center' : 'items-baseline'
    )}
  >
    <Typography variant='eyebrow' component='h2' sx={{color: 'primary.main'}}>
      {title}
    </Typography>

    {meta && (
      <Typography variant='small' sx={{color: 'text.disabled'}}>
        {meta}
      </Typography>
    )}

    {action && (
      <>
        <Box className='bg-rule h-px min-w-6 flex-auto' />
        {action}
      </>
    )}
  </Box>
);

export default SectionHeading;
