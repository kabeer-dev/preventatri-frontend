// ** MUI Imports
import {alpha, useTheme} from '@mui/material/styles';

import {ThemeColor} from '@/@core/theme/types';

export type ThemeColorState = {
  light: {
    color: string;
    backgroundColor: string;
  };
  main: {
    color: string;
    backgroundColor: string;
  };
};

export type UseThemeColorsType = {
  [key in ThemeColor]: ThemeColorState;
};

const useThemeColors = (): UseThemeColorsType => {
  // ** Hooks
  const theme = useTheme();

  return {
    primary: {
      light: {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      },
      main: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
      },
    },
    secondary: {
      light: {
        color: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.12),
      },
      main: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
      },
    },
    success: {
      light: {
        color: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.12),
      },
      main: {
        color: theme.palette.success.contrastText,
        backgroundColor: theme.palette.success.main,
      },
    },
    error: {
      light: {
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.12),
      },
      main: {
        color: theme.palette.error.contrastText,
        backgroundColor: theme.palette.error.main,
      },
    },
    warning: {
      light: {
        color: theme.palette.warning.main,
        backgroundColor: alpha(theme.palette.warning.main, 0.12),
      },
      main: {
        color: theme.palette.warning.contrastText,
        backgroundColor: theme.palette.warning.main,
      },
    },
    info: {
      light: {
        color: theme.palette.info.main,
        backgroundColor: alpha(theme.palette.info.main, 0.12),
      },
      main: {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
      },
    },
  };
};

export default useThemeColors;
