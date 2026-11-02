import {Components, Theme} from '@mui/material/styles';

const TRACK_WIDTH = 42;
const TRACK_HEIGHT = 22;
const THUMB_SIZE = 18;
const THUMB_INSET = 2;

const Switch = (theme: Theme): Components['MuiSwitch'] => {
  return {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        padding: 0,
      },
      switchBase: {
        padding: THUMB_INSET,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: `translateX(${TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2}px)`,
          color: theme.palette.common.white,
          '& + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary.main,
            opacity: 1,
            border: 0,
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
          boxShadow: `0 0 0 3px ${theme.palette.customColors.brandEdge}`,
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
          color: theme.palette.customColors.surfaceRaised,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.6,
        },
      },
      thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        boxShadow: '0 1px 2px 0 rgb(16 24 40 / 0.1)',
      },
      track: {
        borderRadius: TRACK_HEIGHT / 2,
        backgroundColor: theme.palette.customColors.borderStrong,
        opacity: 1,
        transition: 'background-color 300ms ease',
      },
    },
  };
};

export default Switch;
