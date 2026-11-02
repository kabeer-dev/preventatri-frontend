import {createElement} from 'react';

import {buttonClasses} from '@mui/material/Button';
import {Components, Theme} from '@mui/material/styles';

import {buttonLoaderSize, controlHeight} from '@/@core/theme/spacing';
import Loader from '@/shared/components/common/loaders/Loader';

const indicator = `& .${buttonClasses.loadingIndicator}`;

const Button = (theme: Theme): Components['MuiButton'] => {
  return {
    defaultProps: {
      disableElevation: true,
      loadingIndicator: createElement(Loader, {
        size: buttonLoaderSize,
        className: 'text-inherit',
      }),
    },
    styleOverrides: {
      root: {
        ...theme.typography.bodyStrong,
        textTransform: 'none',
        lineHeight: 1.2,
      },
      sizeSmall: {minHeight: controlHeight.sm},
      sizeMedium: {minHeight: controlHeight.md},
      sizeLarge: {minHeight: controlHeight.lg},

      text: {[indicator]: {color: 'var(--variant-textColor)'}},
      outlined: {[indicator]: {color: 'var(--variant-outlinedColor)'}},
      contained: {
        [indicator]: {color: 'var(--variant-containedColor)'},
        [`&&.${buttonClasses.disabled}`]: {
          backgroundColor: `var(--variant-containedBg, ${theme.palette.primary.main})`,
          color: `var(--variant-containedColor, ${theme.palette.common.white})`,
          opacity: 0.45,
        },

        // The disabled rule above restores the label colour, which would undo
        // MUI hiding the label while loading. A loading button is busy, not
        // unavailable, so it also keeps full opacity.
        [`&&.${buttonClasses.loading}`]: {color: 'transparent', opacity: 1},
      },
    },
  };
};

export default Button;
