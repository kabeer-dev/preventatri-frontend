import {PaletteMode, ThemeOptions} from '@mui/material';
import {deepmerge} from '@mui/utils';

import breakpoints from '@/@core/theme/breakpoints';
import overrides from '@/@core/theme/overrides';
import palette from '@/@core/theme/palette';
import shadows from '@/@core/theme/shadows';
import spacing, {layout, radius} from '@/@core/theme/spacing';
import {ThemeMode, ThemeSkin} from '@/@core/theme/types';
import typography from '@/@core/theme/typography';

export interface ThemeSettings {
  mode: ThemeMode;
  skin: ThemeSkin;
  direction: 'ltr' | 'rtl';
  themeColor:
    'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

interface ThemeOptionsParams {
  settings: ThemeSettings;
  overrideMode: PaletteMode;
}

const themeOptions = ({
  settings,
  overrideMode,
}: ThemeOptionsParams): ThemeOptions => {
  const {skin, mode, direction, themeColor} = settings;
  const paletteMode = mode === 'semi-dark' ? overrideMode : mode;

  const mergedThemeConfig: ThemeOptions = {
    cssVariables: true,
    breakpoints: breakpoints(),
    direction,
    palette: palette({mode: paletteMode, skin}),
    ...spacing,
    shape: {
      borderRadius: radius.md,
    },
    mixins: {
      toolbar: {
        minHeight: layout.topBarHeight,
      },
    },
    shadows: shadows({mode: paletteMode}),
    typography,
  };

  return deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...(mergedThemeConfig.palette
          ? mergedThemeConfig.palette[themeColor]
          : palette({mode: paletteMode, skin}).primary),
      },
    },
    components: overrides(mergedThemeConfig as any),
  });
};

export default themeOptions;
