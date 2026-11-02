'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import {AlertReviewCardProps} from '@/shared/interfaces/alertReview';

const AlertReviewCard = ({
  title,
  meta,
  action,
  children,
}: AlertReviewCardProps) => (
  <Card component='section' sx={{minWidth: 0, overflow: 'hidden'}}>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 2.5,
        rowGap: 1,
        px: 4.5,
        pt: 3.75,
        pb: 3.25,
      }}
    >
      <Typography
        variant='eyebrow'
        component='h2'
        sx={{color: 'text.secondary'}}
      >
        {title}
      </Typography>
      {meta && (
        <Typography variant='small' sx={{color: 'customColors.inkFaint'}}>
          {meta}
        </Typography>
      )}
      {action && <Box sx={{ml: 'auto'}}>{action}</Box>}
    </Box>

    {children}
  </Card>
);

export default AlertReviewCard;
