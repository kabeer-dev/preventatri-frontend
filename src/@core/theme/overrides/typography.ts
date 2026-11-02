import {Components, Theme} from '@mui/material/styles';

const Typography = (theme: Theme): Components['MuiTypography'] => {
  return {
    defaultProps: {
      variantMapping: {
        display: 'h1',
        metric: 'p',
        body: 'p',
        bodyStrong: 'p',
        small: 'p',
        eyebrow: 'span',
        mono: 'span',
        errorCode: 'p',
      },
    },

    styleOverrides: {
      root: {
        '&.MuiTypography-eyebrow': {
          color: theme.palette.customColors.inkFaint,
        },
      },
    },
  };
};

export default Typography;
