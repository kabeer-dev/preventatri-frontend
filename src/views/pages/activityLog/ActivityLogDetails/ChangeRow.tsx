'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {AuditLogChange} from '@/shared/interfaces/activityLog';

// One "what changed" line: a title on top, its description underneath. Used
// both for actual field changes and the 'no-change' placeholder row (e.g.
// "No changes" / "The record was viewed").
const ChangeRow = ({title, description}: AuditLogChange) => (
  <Box
    sx={{
      py: 1.25,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': {borderBottom: 0},
    }}
  >
    <Typography variant='body2' sx={{fontWeight: 600, color: 'text.primary'}}>
      {title}
    </Typography>
    <Typography variant='body2' sx={{color: 'text.secondary'}}>
      {description}
    </Typography>
  </Box>
);

export default ChangeRow;
