import {autocompleteClasses} from '@mui/material/Autocomplete';
import {inputBaseClasses} from '@mui/material/InputBase';
import {outlinedInputClasses} from '@mui/material/OutlinedInput';
import {Components} from '@mui/material/styles';

import {controlPaddingY} from '@/@core/theme/spacing';

// The padding lives on the input root rather than the input itself so that
// selected chips (which are siblings of the input) keep the same clearance from
// the outline as the text does, including once they wrap onto a second row.
const Autocomplete = (): Components['MuiAutocomplete'] => {
  return {
    styleOverrides: {
      root: {
        [`& .${autocompleteClasses.inputRoot}.${outlinedInputClasses.root}`]: {
          paddingTop: controlPaddingY.md,
          paddingBottom: controlPaddingY.md,
          [`&.${inputBaseClasses.sizeSmall}`]: {
            paddingTop: controlPaddingY.sm,
            paddingBottom: controlPaddingY.sm,
          },
          [`& .${autocompleteClasses.input}`]: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
  };
};

export default Autocomplete;
