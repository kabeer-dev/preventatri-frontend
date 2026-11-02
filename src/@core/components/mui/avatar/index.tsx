'use client';

// ** React Imports
import {forwardRef, Ref} from 'react';

// ** MUI Imports
import MuiAvatar from '@mui/material/Avatar';
import {lighten, Theme, useTheme} from '@mui/material/styles';

import useThemeColors, {UseThemeColorsType} from '@/@core/hooks/useThemeColors';
import {ThemeColor} from '@/@core/theme/types';

// ** Types
import {CustomAvatarProps} from './types';

const getAvatarStyles = ({
  avatarSkin,
  skinColor,
  themeColors,
  theme,
}: {
  avatarSkin: 'filled' | 'light' | 'light-static' | undefined;
  skinColor: ThemeColor;
  themeColors: UseThemeColorsType;
  theme: Theme;
}) => {
  let avatarStyles;

  if (avatarSkin === 'light') {
    avatarStyles = {...themeColors[skinColor].light};
  } else if (avatarSkin === 'light-static') {
    avatarStyles = {
      color: themeColors[skinColor].light.color,
      backgroundColor: lighten(theme.palette[skinColor].main, 0.88),
    };
  } else {
    avatarStyles = {...themeColors[skinColor].main};
  }

  return avatarStyles;
};

const CustomAvatar = forwardRef(
  (props: CustomAvatarProps, ref: Ref<HTMLDivElement>) => {
    // ** Props
    const {sx, src, skin = 'filled', color = 'primary', ...rest} = props;

    // ** Hook
    const theme = useTheme();
    const themeColors: UseThemeColorsType = useThemeColors();

    const colors = {
      primary: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'primary',
        themeColors,
        theme,
      }),
      secondary: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'secondary',
        themeColors,
        theme,
      }),
      success: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'success',
        themeColors,
        theme,
      }),
      error: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'error',
        themeColors,
        theme,
      }),
      warning: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'warning',
        themeColors,
        theme,
      }),
      info: getAvatarStyles({
        avatarSkin: skin,
        skinColor: 'info',
        themeColors,
        theme,
      }),
    };

    return (
      <MuiAvatar
        ref={ref}
        src={src}
        {...rest}
        sx={!src && skin && color ? {...colors[color], ...sx} : sx}
      />
    );
  }
);

CustomAvatar.displayName = 'CustomAvatar';

export default CustomAvatar;
