'use client';

import {ReactNode} from 'react';

import Box from '@mui/material/Box';
import {SxProps, Theme} from '@mui/material/styles';

import {layout, topBarOuterHeight} from '@/@core/theme/spacing';

interface Props {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * The desktop runner owns the whole page below the top bar: it cancels the
 * shell's gutters, fills the viewport and paints the paper background.
 */
const RunnerFullBleed = ({children, sx}: Props) => (
  <Box
    sx={{
      height: `calc(100vh - ${topBarOuterHeight}px)`,
      mx: `-${layout.pageGutter}px`,
      my: `-${layout.pageGutterY}px`,
      backgroundColor: 'background.paper',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default RunnerFullBleed;
