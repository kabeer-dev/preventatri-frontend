import {Components, Theme} from '@mui/material/styles';

const Chip = (theme: Theme): Components['MuiChip'] => {
  return {
    styleOverrides: {
      root: {...theme.typography.small, fontWeight: 600},
    },
  };
};

export default Chip;
