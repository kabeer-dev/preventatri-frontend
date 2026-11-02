'use client';

import {useMemo} from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';

import themeOptions, {ThemeSettings} from '@/@core/theme/ThemeOptions';
import themeConfig from '@/configs/themeConfig';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import {useSettings} from '@/shared/providers/SettingsProvider';

// Import theme types to extend MUI types
import '@/@core/theme/types';

const ThemeProvider = ({children}: NodeChildrenProps) => {
  // Get settings from context
  const {settings} = useSettings();

  // Create theme settings based on global settings
  const themeSettings: ThemeSettings = useMemo(
    () => ({
      mode: settings.mode,
      skin: settings.skin,
      direction: settings.direction,
      themeColor: 'primary', // This could also come from settings if added there
    }),
    [settings]
  );

  // Create theme with @core theme configuration
  const theme = useMemo(() => {
    const paletteMode =
      themeSettings.mode === 'semi-dark' ? 'light' : themeSettings.mode;

    let newTheme = createTheme(
      themeOptions({settings: themeSettings, overrideMode: paletteMode})
    );

    // Apply responsive font sizes if enabled
    if (themeConfig.responsiveFontSizes) {
      newTheme = responsiveFontSizes(newTheme);
    }

    return newTheme;
  }, [themeSettings]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
