import type {Palette} from '@mui/material';

import {ThemeSkin} from '@/@core/theme/types';

export const neutralColors = {
  page: '#f4f7f7',
  surface: '#ffffff',
  surfaceRaised: '#fafbfb',
  border: '#e6ebe9',
  rule: '#f3f5f4',
  ruleStrong: '#eef1f0',
  ink: '#1a2422',
  inkMuted: '#4b5a57',
  inkSubtle: '#8a9794',

  inkFaint: '#9aa8a5',
  inkSoft: '#6d7a77',
  segmentTrack: '#eaeff0',
  borderStrong: '#d7dfde',
} as const;

export const brandColors = {
  brand: '#155e63',
  brandHover: '#0f464a',
  brandTint: '#e3f1f2',
  brandEdge: '#bfdcde',
  brandBright: '#6ad4de',
  brandMuted: '#4d7b7e',
} as const;

const shellColors = {
  shell: '#132428',
  shellRaised: '#1c3237',
  shellActive: '#22403f',
  shellText: '#bdd2d5',
  shellMuted: '#7e9498',

  // The one destructive control that sits on the dark shell: the sidebar's
  // "Raise a red flag" button. The light-surface error red is unreadable
  // there, so the shell carries its own outline and text pair.
  shellDanger: '#5a2a26',
  shellDangerText: '#ffb4a8',
} as const;

const severityColors = {
  severityCriticalBar: '#b42318',
  severityCriticalBg: '#fef2f2',
  severityCriticalFg: '#b42318',
  severityModerateBar: '#e0c15c',
  severityModerateBg: '#fffaeb',
  severityModerateFg: '#854a0e',
  severityStableBar: '#12b76a',
  severityStableBg: '#ecfdf3',
  severityStableFg: '#067647',

  // An alert its assignee accepted: taken, not yet resolved.
  alertAcceptedBar: '#2e90fa',
} as const;

// One visually distinct bg/fg pair per AUDIT_OPERATIONS entry (see
// shared/constants/activityLog.ts) so no two actions render as the same
// color chip in the activity log.
const auditActionColors = {
  auditActionCreateBg: '#eff8ff',
  auditActionCreateFg: '#175cd3',
  auditActionReadBg: '#ecfdf3',
  auditActionReadFg: '#067647',
  auditActionUpdateBg: '#fef9c3',
  auditActionUpdateFg: '#854d0e',
  auditActionDeleteBg: '#fef2f2',
  auditActionDeleteFg: '#b42318',
  auditActionLoginBg: '#fff7ed',
  auditActionLoginFg: '#b54708',
  auditActionLogoutBg: '#f3f4f6',
  auditActionLogoutFg: '#475467',
  auditActionResetPasswordBg: '#f5f3ff',
  auditActionResetPasswordFg: '#6d28d9',
  auditActionInviteBg: '#ecfeff',
  auditActionInviteFg: '#0e7490',
  auditActionAccountLockBg: '#fbe9e7',
  auditActionAccountLockFg: '#7a271a',
  auditActionAccountUnlockBg: '#f7fee7',
  auditActionAccountUnlockFg: '#3f6212',
  auditActionSyncStartedBg: '#eef2ff',
  auditActionSyncStartedFg: '#3730a3',
  auditActionSyncCompletedBg: '#f0fdfa',
  auditActionSyncCompletedFg: '#0f766e',
  auditActionSyncFailedBg: '#fff1f2',
  auditActionSyncFailedFg: '#9f1239',
  auditActionEscalationAcceptedBg: '#eef4ff',
  auditActionEscalationAcceptedFg: '#3538cd',
} as const;

const semanticColors = {
  secondary: neutralColors.inkMuted,
  error: severityColors.severityCriticalFg,
  warning: severityColors.severityModerateFg,
  info: '#175cd3',
  success: severityColors.severityStableFg,
} as const;

interface DefaultPaletteParams {
  mode: Palette['mode'];
  skin: ThemeSkin;
}

const DefaultPalette = ({mode, skin}: DefaultPaletteParams): Palette => {
  const whiteColor = neutralColors.surface;

  const defaultBgColor =
    skin === 'bordered' ? neutralColors.surface : neutralColors.page;

  return {
    customColors: {
      brandTint: brandColors.brandTint,
      brandEdge: brandColors.brandEdge,
      inkFaint: neutralColors.inkFaint,
      inkSoft: neutralColors.inkSoft,
      segmentTrack: neutralColors.segmentTrack,
      borderStrong: neutralColors.borderStrong,
      brandMuted: brandColors.brandMuted,
      rule: neutralColors.rule,
      ruleStrong: neutralColors.ruleStrong,
      surfaceRaised: neutralColors.surfaceRaised,
      ...shellColors,
      ...severityColors,
      ...auditActionColors,
    },
    mode,
    common: {
      black: '#000',
      white: whiteColor,
    },
    primary: {
      light: brandColors.brandBright,
      main: brandColors.brand,
      dark: brandColors.brandHover,
      contrastText: whiteColor,
    },
    secondary: {
      main: semanticColors.secondary,
      contrastText: whiteColor,
    },
    error: {
      main: semanticColors.error,
      contrastText: whiteColor,
    },
    warning: {
      main: semanticColors.warning,
      contrastText: whiteColor,
    },
    info: {
      main: semanticColors.info,
      contrastText: whiteColor,
    },
    success: {
      main: semanticColors.success,
      contrastText: whiteColor,
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: neutralColors.ink,
      secondary: neutralColors.inkMuted,
      disabled: neutralColors.inkSubtle,
    },
    divider: neutralColors.border,
    background: {
      paper: neutralColors.surface,
      default: defaultBgColor,
    },
    action: {
      active: neutralColors.inkMuted,
      hover: neutralColors.surfaceRaised,
      hoverOpacity: 0.05,
      selected: brandColors.brandTint,
      disabled: neutralColors.inkSubtle,
      disabledBackground: neutralColors.rule,
      focus: brandColors.brandEdge,
    },
  } as Palette;
};

export default DefaultPalette;
