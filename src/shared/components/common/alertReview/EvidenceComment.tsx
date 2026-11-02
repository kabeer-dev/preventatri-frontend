'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {ALERT_REVIEW_ROW_SX} from '@/shared/constants/alertReview';
import {DETAIL_IDENTITY_SEPARATOR} from '@/shared/constants/common';
import {TIMELINE_TIMESTAMP_FORMAT} from '@/shared/constants/flag';
import {EvidenceCommentProps} from '@/shared/interfaces/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';

const EvidenceComment = ({label, author, at, text}: EvidenceCommentProps) => {
  const byline = [
    author,
    at ? formatDate({date: at, format: TIMELINE_TIMESTAMP_FORMAT}) : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Box
      sx={{
        ...ALERT_REVIEW_ROW_SX,
        pt: 3.25,
        pb: 4,
        backgroundColor: 'customColors.surfaceRaised',
      }}
    >
      <Typography
        variant='small'
        component='h3'
        sx={{fontWeight: 700, color: 'text.secondary', mb: 1.25}}
      >
        {[label, byline].filter(Boolean).join(DETAIL_IDENTITY_SEPARATOR)}
      </Typography>
      <Typography
        variant='body'
        component='p'
        sx={{
          m: 0,
          maxWidth: '70ch',
          color: 'text.secondary',
          whiteSpace: 'pre-wrap',
        }}
      >
        {`“${text}”`}
      </Typography>
    </Box>
  );
};

export default EvidenceComment;
