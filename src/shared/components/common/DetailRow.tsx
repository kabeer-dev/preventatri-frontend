'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {DetailRowProps} from '@/shared/interfaces/detailRow';

/**
 * One label / value line of a detail dialog: a fixed-width muted label on the
 * left, the value on the right. Extracted from SupervisoryVisitDetailModal so
 * every detail dialog lays its rows out the same way.
 */
const DetailRow = ({label, value}: DetailRowProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr',
      alignItems: 'center',
      gap: 2,
      py: 1,
    }}
  >
    <Typography variant='body2' sx={{color: 'text.secondary'}}>
      {label}
    </Typography>
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>{value}</Box>
  </Box>
);

export default DetailRow;
