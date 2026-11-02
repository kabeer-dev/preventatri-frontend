import {Components, Theme} from '@mui/material/styles';

import MuiAutocomplete from './autocomplete';
import MuiButton from './button';
import MuiCard from './card';
import MuiChip from './chip';
import MuiDialog from './dialog';
import MuiFormHelperText from './formHelperText';
import MuiListItemIcon from './listItemIcon';
import MuiOutlinedInput from './outlinedInput';
import MuiPickersOutlinedInput from './pickersOutlinedInput';
import MuiSwitch from './switch';
import MuiTypography from './typography';

const Overrides = (theme: Theme): Components => {
  const autocomplete = MuiAutocomplete();
  const button = MuiButton(theme);
  const card = MuiCard();
  const chip = MuiChip(theme);
  const dialog = MuiDialog();
  const formHelperText = MuiFormHelperText();
  const listItemIcon = MuiListItemIcon();
  const outlinedInput = MuiOutlinedInput(theme);
  const pickersOutlinedInput = MuiPickersOutlinedInput(theme);
  const switchInput = MuiSwitch(theme);
  const typography = MuiTypography(theme);

  return {
    MuiAutocomplete: autocomplete,
    MuiButton: button,
    MuiCard: card,
    MuiChip: chip,
    MuiDialog: dialog,
    MuiFormHelperText: formHelperText,
    MuiListItemIcon: listItemIcon,
    MuiOutlinedInput: outlinedInput,
    MuiPickersOutlinedInput: pickersOutlinedInput,
    MuiSwitch: switchInput,
    MuiTypography: typography,
  };
};

export default Overrides;
