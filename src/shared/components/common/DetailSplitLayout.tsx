'use client';

import Box from '@mui/material/Box';

import {layout} from '@/@core/theme/spacing';
import {DetailSplitLayoutProps} from '@/shared/interfaces/layout';

const DetailSplitLayout = ({main, rail}: DetailSplitLayoutProps) => (
  <Box
    className='grid items-start gap-4'
    sx={{
      gridTemplateColumns: {
        xs: '1fr',
        lg: `minmax(0, 1fr) ${layout.detailRailWidth}px`,
      },
    }}
  >
    <Box className='flex min-w-0 flex-col gap-4'>{main}</Box>
    <Box className='flex min-w-0 flex-col gap-4'>{rail}</Box>
  </Box>
);

export default DetailSplitLayout;
