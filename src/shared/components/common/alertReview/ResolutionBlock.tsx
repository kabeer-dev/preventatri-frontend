'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {ALERT_REVIEW_ROW_SX} from '@/shared/constants/alertReview';
import {ResolutionBlockProps} from '@/shared/interfaces/alertReview';

const ResolutionBlock = ({label, icon, children}: ResolutionBlockProps) => (
  <Box sx={{...ALERT_REVIEW_ROW_SX, pt: 3.25, pb: 3.75}}>
    <Typography
      variant='small'
      component='h3'
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        mb: 2.25,
        fontWeight: 700,
        color: 'text.secondary',
      }}
    >
      {icon && (
        <Box
          component='span'
          sx={{display: 'flex', color: 'customColors.brandMuted'}}
        >
          <Icon icon={icon} fontSize={16} />
        </Box>
      )}
      {label}
    </Typography>
    {children}
  </Box>
);

export default ResolutionBlock;
