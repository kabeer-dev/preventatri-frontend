import {SxProps, Theme} from '@mui/material/styles';

import typography from '@/@core/theme/typography';

/**
 * Generic DataGrid styles
 */

export const getDataTableGridStyles = ({
  clickableRows = false,
  skeletonHeight,
}: {
  clickableRows?: boolean;
  skeletonHeight?: number;
} = {}): SxProps<Theme> => ({
  border: 0,
  '--DataGrid-rowBorderColor': 'var(--mui-palette-customColors-rule)',

  // This variable only sizes the empty auto-height grid's box; the skeleton
  // row count itself comes from DataTableSkeletonOverlay.
  ...(skeletonHeight && {'--DataGrid-overlayHeight': `${skeletonHeight}px`}),

  '& .MuiDataGrid-columnHeaderTitle': {
    ...typography.eyebrow,
    color: 'customColors.inkFaint',
  },

  // The frame separates the header from the rows with a stronger rule than the
  // one between rows.
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: '1px solid',
    borderColor: 'customColors.ruleStrong',
  },

  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'customColors.surfaceRaised',
    '@media (hover: none)': {backgroundColor: 'transparent'},
  },

  // Cell styling - remove blue focus border

  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    py: 2,
    outline: 'none !important',
  },

  // Clickable row styling
  ...(clickableRows && {
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
    },
  }),
});
