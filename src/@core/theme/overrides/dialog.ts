import {Components} from '@mui/material/styles';

import {radius} from '@/@core/theme/spacing';

const Dialog = (): Components['MuiDialog'] => {
  return {
    styleOverrides: {
      paper: {borderRadius: radius.md},
      paperFullScreen: {borderRadius: 0},
    },
  };
};

export default Dialog;
