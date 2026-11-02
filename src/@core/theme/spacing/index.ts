export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const controlHeight = {
  sm: 32,
  md: 40,
  lg: 48,

  /** A phone tap target: the caregiver's pinned action, tabs and list rows. */
  xl: 52,
} as const;

export const buttonLoaderSize = 22;

export const controlPaddingY = {
  sm: 5.5,
  md: 9.5,
} as const;

export const layout = {
  sidebarWidth: 268,
  topBarHeight: 74,
  topBarActionSize: 36,
  topBarActionIconSize: 18,
  sidebarHeaderHeight: 55,

  /** Full height of a nav section title row: 14px above, 11px text, 7px below. */
  navSectionTitleHeight: 32,
  navIconSize: 18,
  navSubIconSize: 14,
  navBulletSize: 8,
  pageGutter: 26,

  pageGutterY: 16,

  /** Side gutter of the phone shell, where 26px would eat the screen. */
  phoneGutter: 16,
  drawerWidth: 520,
  modalWidth: 460,
  detailRailWidth: 336,

  /** Widest a form or a single column of reading should get. */
  formMaxWidth: 760,
} as const;

/**
 * What the top bar really takes off the viewport: its own height plus the
 * hairline border under it. A full height screen that subtracts only
 * `topBarHeight` is one pixel too tall and puts a scrollbar on the page.
 */
export const topBarOuterHeight = layout.topBarHeight + 1;

const spacingConfig = {
  spacing: (factor: number) => `${0.25 * factor}rem`,
};

export default spacingConfig;
