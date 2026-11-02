import {PaletteMode, ThemeOptions} from '@mui/material';

const lightElevation = {
  resting: '0 1px 3px rgba(26, 36, 34, 0.06)',
  hover: '0 6px 18px rgba(26, 36, 34, 0.1)',
  popover: '0 12px 28px rgba(26, 36, 34, 0.16)',
  modal: '0 24px 60px rgba(19, 36, 40, 0.26)',
} as const;

const darkElevation = {
  resting: '0 1px 3px rgba(0, 0, 0, 0.4)',
  hover: '0 6px 18px rgba(0, 0, 0, 0.5)',
  popover: '0 12px 28px rgba(0, 0, 0, 0.55)',
  modal: '0 24px 60px rgba(0, 0, 0, 0.6)',
} as const;

interface ShadowsParams {
  mode: PaletteMode;
}

const Shadows = ({mode}: ShadowsParams): ThemeOptions['shadows'] => {
  const {resting, hover, popover, modal} =
    mode === 'light' ? lightElevation : darkElevation;

  return [
    'none',
    resting,
    resting,
    resting,
    resting,
    resting,
    resting,
    hover,
    popover,
    popover,
    popover,
    popover,
    popover,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
    modal,
  ];
};

export default Shadows;
