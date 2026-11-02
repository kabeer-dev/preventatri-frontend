/**
 * Theme Configuration
 * -------------------------------------------------------------------------------------
 * ! IMPORTANT: Make sure you clear the browser local storage in order to see the config changes.
 */

import {layout} from '@/@core/theme/spacing';
import {
  ThemeMode,
  ThemeSkin,
  ThemeLayout,
  AppBar,
  Footer,
} from '@/@core/theme/types';

type ThemeConfig = {
  skin: ThemeSkin;
  mode: ThemeMode;
  appBar: AppBar;
  footer: Footer;
  navHidden: boolean;
  direction: 'ltr' | 'rtl';
  templateName: string;
  navCollapsed: boolean;
  routingLoader: boolean;
  disableRipple: boolean;
  navigationSize: number;
  menuTextTruncate: boolean;
  responsiveFontSizes: boolean;
  collapsedNavigationSize: number;
  afterVerticalNavMenuContentPosition: 'static' | 'fixed';
  layout: ThemeLayout;
  toastPosition:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
};

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: process.env.NEXT_PUBLIC_PROJECT_NAME || 'PreventaTri',
  layout: 'vertical',
  mode: 'light' as ThemeMode,
  direction: 'ltr',
  skin: 'default',
  footer: 'static',

  // ** Routing Configs
  routingLoader: true,

  // ** Navigation (Menu) Configs
  navHidden: false,
  menuTextTruncate: true,
  navCollapsed: false,
  navigationSize: layout.sidebarWidth,
  collapsedNavigationSize: 68,

  // Pins any afterContent the sidebar is given below the scrolling nav list
  // and above the profile block. Inert unless a layout passes afterContent.
  afterVerticalNavMenuContentPosition: 'fixed',

  // ** AppBar Configs
  appBar: 'fixed',

  // ** Other Configs
  // The design publishes fixed sizes; per-breakpoint rescaling would stop h1-h3
  // matching Figma exactly.
  responsiveFontSizes: false,
  disableRipple: false,
  toastPosition: 'top-right',
};

export default themeConfig;
