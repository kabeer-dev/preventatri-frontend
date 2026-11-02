'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {
  WorkItemFactProps,
  WorkItemSectionTitleProps,
} from '@/shared/interfaces/workItem';

// One label / value row of a follow-up task or supervisory visit facts card.
const WorkItemFact = ({label, value}: WorkItemFactProps) => (
  <Box
    className='flex items-start justify-between gap-3 border-b py-2 last:border-b-0'
    sx={{borderColor: 'divider'}}
  >
    <Typography variant='small' sx={{color: 'text.secondary', flex: 'none'}}>
      {label}
    </Typography>
    <Typography
      variant='body2'
      component='div'
      className='min-w-0 text-right'
      sx={{fontWeight: 500}}
    >
      {value || DETAIL_EMPTY_VALUE}
    </Typography>
  </Box>
);

export const WorkItemSectionTitle = ({children}: WorkItemSectionTitleProps) => (
  <Typography
    variant='caption'
    className='mb-1 block font-bold uppercase'
    sx={{color: 'text.secondary', letterSpacing: 0.6}}
  >
    {children}
  </Typography>
);

export default WorkItemFact;
