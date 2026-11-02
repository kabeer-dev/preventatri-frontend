'use client';

import MuiChip from '@mui/material/Chip';
import {SxProps, Theme} from '@mui/material/styles';
import clsx from 'clsx';

import useThemeColors from '@/@core/hooks/useThemeColors';

import {CustomChipProps} from './types';

// Default sx styles for consistent chip appearance across the app
const defaultSx: SxProps<Theme> = {
  '& .MuiChip-label': {lineHeight: '18px'},
};

const CustomChip = (props: CustomChipProps) => {
  // ** Props with defaults
  const {
    sx,
    skin = 'light',
    size = 'small',
    color = 'primary',
    rounded,
    className,
    ...rest
  } = props;

  // ** Hook
  const themeColors = useThemeColors();

  const colors = {
    primary: {...themeColors.primary.light},
    secondary: {...themeColors.secondary.light},
    success: {...themeColors.success.light},
    error: {...themeColors.error.light},
    warning: {...themeColors.warning.light},
    info: {...themeColors.info.light},
  } as any;

  // Merge default sx with provided sx (provided sx takes precedence)
  const mergedSx =
    skin === 'light' && color && color in colors
      ? {...colors[color], ...defaultSx, ...sx}
      : {...defaultSx, ...sx};

  return (
    <MuiChip
      {...rest}
      size={size}
      color={color}
      variant='filled'
      className={clsx(className, {
        'MuiChip-rounded': rounded,
        'MuiChip-light': skin === 'light',
      })}
      sx={mergedSx}
    />
  );
};

export default CustomChip;
