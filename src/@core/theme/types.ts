import {CSSProperties} from 'react';

import {Theme, TypographyStyle} from '@mui/material/styles';

interface CustomColors {
  brandTint: string;
  brandEdge: string;
  inkFaint: string;
  inkSoft: string;
  segmentTrack: string;
  borderStrong: string;
  brandMuted: string;
  rule: string;
  ruleStrong: string;
  surfaceRaised: string;
  shell: string;
  shellRaised: string;
  shellActive: string;
  shellText: string;
  shellMuted: string;
  shellDanger: string;
  shellDangerText: string;
  severityCriticalBar: string;
  severityCriticalBg: string;
  severityCriticalFg: string;
  severityModerateBar: string;
  severityModerateBg: string;
  severityModerateFg: string;
  severityStableBar: string;
  severityStableBg: string;
  severityStableFg: string;
  alertAcceptedBar: string;
  auditActionCreateBg: string;
  auditActionCreateFg: string;
  auditActionReadBg: string;
  auditActionReadFg: string;
  auditActionUpdateBg: string;
  auditActionUpdateFg: string;
  auditActionDeleteBg: string;
  auditActionDeleteFg: string;
  auditActionLoginBg: string;
  auditActionLoginFg: string;
  auditActionLogoutBg: string;
  auditActionLogoutFg: string;
  auditActionResetPasswordBg: string;
  auditActionResetPasswordFg: string;
  auditActionInviteBg: string;
  auditActionInviteFg: string;
  auditActionAccountLockBg: string;
  auditActionAccountLockFg: string;
  auditActionAccountUnlockBg: string;
  auditActionAccountUnlockFg: string;
  auditActionSyncStartedBg: string;
  auditActionSyncStartedFg: string;
  auditActionSyncCompletedBg: string;
  auditActionSyncCompletedFg: string;
  auditActionSyncFailedBg: string;
  auditActionSyncFailedFg: string;
  auditActionEscalationAcceptedBg: string;
  auditActionEscalationAcceptedFg: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    customColors: CustomColors;
  }

  interface PaletteOptions {
    customColors?: Partial<CustomColors>;
  }

  interface TypographyVariants {
    display: CSSProperties;
    metric: CSSProperties;
    body: CSSProperties;
    bodyStrong: CSSProperties;
    small: CSSProperties;
    eyebrow: CSSProperties;
    mono: CSSProperties;
    errorCode: TypographyStyle;
  }

  interface TypographyVariantsOptions {
    display?: CSSProperties;
    metric?: CSSProperties;
    body?: CSSProperties;
    bodyStrong?: CSSProperties;
    small?: CSSProperties;
    eyebrow?: CSSProperties;
    mono?: CSSProperties;
    errorCode?: TypographyStyle;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    metric: true;
    body: true;
    bodyStrong: true;
    small: true;
    eyebrow: true;
    mono: true;
    errorCode: true;
  }
}

export interface ControlSurfaceParams {
  theme: Theme;
  notchedOutlineClass: string;
  sizeSmallClass: string;
}

export type ThemeMode = 'light' | 'dark' | 'semi-dark';

export type ThemeSkin = 'default' | 'bordered';

export type ThemeLayout = 'vertical' | 'horizontal';

export type ThemeColor =
  'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export type AppBar = 'fixed' | 'static' | 'hidden';

export type Footer = 'fixed' | 'static' | 'hidden';

export interface ThemeSettings {
  mode: ThemeMode;
  skin: ThemeSkin;
  layout: ThemeLayout;
  themeColor: ThemeColor;
  appBar: AppBar;
  footer: Footer;
  navCollapsed: boolean;
  direction: 'ltr' | 'rtl';
}
