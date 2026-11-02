'use client';

import Typography from '@mui/material/Typography';

import {ALERT_REVIEW_ROW_SX} from '@/shared/constants/alertReview';
import {EvidenceEmptyNoteProps} from '@/shared/interfaces/alertReview';

const EvidenceEmptyNote = ({message}: EvidenceEmptyNoteProps) => (
  <Typography
    variant='small'
    component='p'
    sx={{...ALERT_REVIEW_ROW_SX, m: 0, py: 3, color: 'text.secondary'}}
  >
    {message}
  </Typography>
);

export default EvidenceEmptyNote;
