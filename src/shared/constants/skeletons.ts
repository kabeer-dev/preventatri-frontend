import {DETAIL_FACTS_CARD} from '@/shared/constants/common';

export const SKELETON_TEXT_WIDTH = {
  xs: 48,
  sm: 80,
  md: 120,
  lg: 180,
  xl: 260,
} as const;

export const SKELETON_CHIP_HEIGHT = {
  small: 24,
  medium: 32,
} as const;

export const TABLE_SKELETON = {
  headerHeight: 56,
  footerHeight: 56,
  paddingX: 4,
  columns: 4,
  avatarSize: 32,
} as const;

export const SKELETON_ROW = {
  leadingSize: 32,
  lines: 2,
  maxLines: 3,
  inlineLabelWidth: DETAIL_FACTS_CARD.inlineLabelWidth,
} as const;

// Notification rows shown while the first page loads; three lines match a
// title, description and delivery status
export const NOTIFICATION_SKELETON = {
  rows: 6,
  lines: 3,
} as const;

export const CARD_ROWS_SKELETON = {
  rows: 3,
  minHeight: 64,
} as const;

export const SKELETON_CARD = {
  rows: 3,
  profileAvatarSize: 100,
} as const;

export const SKELETON_LAYOUT = {
  formMaxWidth: 760,
} as const;

// Settings sections: sizes copied from the switch, time picker, radio and
// step badge they stand in for
export const SETTINGS_SKELETON = {
  switchWidth: 42,
  switchHeight: 22,
  buttonWidth: 72,
  radioSize: 24,
  iconSize: 20,
  stepBadgeSize: 24,
  otpOptions: 3,
  escalationSteps: 3,
} as const;
