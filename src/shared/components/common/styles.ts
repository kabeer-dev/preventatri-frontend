import {Theme} from '@mui/material/styles';

// Thin, theme-colored scrollbar for lists that scroll inside a card or panel.
export const thinScrollbarSx = {
  scrollbarWidth: 'thin',
  scrollbarColor: (theme: Theme) => `${theme.palette.divider} transparent`,
  '&::-webkit-scrollbar': {width: 6},
  '&::-webkit-scrollbar-track': {backgroundColor: 'transparent'},
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'divider',
    borderRadius: '3px',
    transition: 'background-color .3s ease-in-out',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'text.disabled',
  },
} as const;
