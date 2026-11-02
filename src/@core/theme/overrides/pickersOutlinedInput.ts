import {Components, Theme} from '@mui/material/styles';
import {
  pickersInputBaseClasses,
  pickersOutlinedInputClasses,
} from '@mui/x-date-pickers/PickersTextField';
import '@mui/x-date-pickers/themeAugmentation';

import controlSurface from '@/@core/theme/overrides/controlSurface';
import {controlPaddingY} from '@/@core/theme/spacing';

const PickersOutlinedInput = (
  theme: Theme
): Components['MuiPickersOutlinedInput'] => {
  return {
    styleOverrides: {
      root: {
        ...controlSurface({
          theme,
          notchedOutlineClass: pickersOutlinedInputClasses.notchedOutline,
          sizeSmallClass: pickersInputBaseClasses.inputSizeSmall,
        }),
        [`&.${pickersInputBaseClasses.inputSizeSmall} .${pickersInputBaseClasses.sectionsContainer}`]:
          {
            paddingTop: controlPaddingY.sm,
            paddingBottom: controlPaddingY.sm,
          },
      },
      sectionsContainer: {
        paddingTop: controlPaddingY.md,
        paddingBottom: controlPaddingY.md,
      },
    },
  };
};

export default PickersOutlinedInput;
