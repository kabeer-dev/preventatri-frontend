'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {AuditLogRelatedRecord} from '@/shared/interfaces/activityLog';

const RelatedRecordCard = ({type, label, sublabel}: AuditLogRelatedRecord) => (
  <Box
    sx={{
      px: 2.5,
      py: 2,
      borderRadius: 2,
      backgroundColor: 'customColors.surfaceRaised',
    }}
  >
    <Typography variant='small' sx={{color: 'text.secondary'}}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Typography>
    <Typography variant='bodyStrong' component='div' sx={{mt: 0.5}}>
      {sublabel ? `${label} · ${sublabel}` : label}
    </Typography>
  </Box>
);

export default RelatedRecordCard;
