import {Components} from '@mui/material/styles';

import {radius} from '@/@core/theme/spacing';

const Card = (): Components['MuiCard'] => {
  return {
    defaultProps: {elevation: 6},
    styleOverrides: {
      root: {borderRadius: radius.md},
    },
  };
};

export default Card;
