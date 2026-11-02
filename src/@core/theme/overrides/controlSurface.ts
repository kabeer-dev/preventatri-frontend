import {inputBaseClasses} from '@mui/material/InputBase';

import {controlHeight} from '@/@core/theme/spacing';
import {ControlSurfaceParams} from '@/@core/theme/types';

const controlSurface = ({
  theme,
  notchedOutlineClass,
  sizeSmallClass,
}: ControlSurfaceParams) => ({
  minHeight: controlHeight.md,
  [`&.${sizeSmallClass}`]: {minHeight: controlHeight.sm},
  backgroundColor: theme.palette.background.paper,
  [`& .${notchedOutlineClass}`]: {borderColor: theme.palette.divider},

  [`&.${inputBaseClasses.disabled}`]: {
    backgroundColor: theme.palette.customColors.surfaceRaised,
    color: theme.palette.customColors.inkFaint,
    [`& .${notchedOutlineClass}`]: {
      borderColor: theme.palette.customColors.ruleStrong,
    },
    [`& .${inputBaseClasses.input}`]: {
      WebkitTextFillColor: theme.palette.customColors.inkFaint,
    },
  },

  // Only where a pointer can actually hover, otherwise a tapped field keeps the
  // hover border until something else is tapped.
  '@media (hover: hover)': {
    [`&:hover:not(.Mui-disabled):not(.Mui-error):not(.Mui-focused) .${notchedOutlineClass}`]:
      {borderColor: theme.palette.text.disabled},
  },
});

export default controlSurface;
