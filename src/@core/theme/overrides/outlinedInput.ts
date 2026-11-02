import {inputBaseClasses} from '@mui/material/InputBase';
import {outlinedInputClasses} from '@mui/material/OutlinedInput';
import {Components, Theme} from '@mui/material/styles';

import controlSurface from '@/@core/theme/overrides/controlSurface';
import {controlPaddingY} from '@/@core/theme/spacing';

const OutlinedInput = (theme: Theme): Components['MuiOutlinedInput'] => {
  return {
    styleOverrides: {
      root: {
        ...controlSurface({
          theme,
          notchedOutlineClass: outlinedInputClasses.notchedOutline,
          sizeSmallClass: inputBaseClasses.sizeSmall,
        }),
        [`&.${inputBaseClasses.sizeSmall} .${outlinedInputClasses.input}`]: {
          paddingTop: controlPaddingY.sm,
          paddingBottom: controlPaddingY.sm,
        },
        [`&.${inputBaseClasses.multiline}`]: {
          paddingTop: controlPaddingY.md,
          paddingBottom: controlPaddingY.md,
          [`& .${outlinedInputClasses.input}`]: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
      input: {
        paddingTop: controlPaddingY.md,
        paddingBottom: controlPaddingY.md,
      },
    },
  };
};

export default OutlinedInput;
