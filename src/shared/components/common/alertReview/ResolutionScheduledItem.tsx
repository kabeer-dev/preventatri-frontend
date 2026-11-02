'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ResolutionBlock from '@/shared/components/common/alertReview/ResolutionBlock';
import {ALERT_REVIEW_SIZES} from '@/shared/constants/alertReview';
import {ResolutionScheduledItemProps} from '@/shared/interfaces/alertReview';

const ResolutionScheduledItem = ({
  icon,
  title,
  facts,
}: ResolutionScheduledItemProps) => (
  <ResolutionBlock label={title} icon={icon}>
    <Box
      component='dl'
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: `${ALERT_REVIEW_SIZES.factLabelWidth}px minmax(0, 1fr)`,
        columnGap: 3,
        rowGap: 1.5,
      }}
    >
      {facts.map(({label, value}) => (
        <Box key={label} sx={{display: 'contents'}}>
          <Typography
            component='dt'
            variant='small'
            sx={{color: 'customColors.inkFaint'}}
          >
            {label}
          </Typography>
          <Typography
            component='dd'
            variant='body'
            sx={{m: 0, color: 'text.secondary', whiteSpace: 'pre-wrap'}}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  </ResolutionBlock>
);

export default ResolutionScheduledItem;
