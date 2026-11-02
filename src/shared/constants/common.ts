import {ThemeColor} from '@/@core/theme/types';

export const DEFAULT_ICON_SIZE = 40;

// CSS cursor values used when toggling the pointer/hand cursor on interactive
// canvas elements (e.g. chart hover).
export const CURSOR = {
  POINTER: 'pointer',
  DEFAULT: 'default',
} as const;

// Placeholder shown in stats cards while loading or when a value is unavailable
export const STATS_FALLBACK = 'N/A';

// Shared active/inactive status used across caregivers, case managers, regions, etc.
export const ACTIVE_STATUS = {
  active: {
    label: 'Active',
    value: 'active',
    color: 'success' as ThemeColor,
  },
  inactive: {
    label: 'Inactive',
    value: 'inactive',
    color: 'error' as ThemeColor,
  },
} as const;

// Array format of ACTIVE_STATUS for select dropdowns
export const ACTIVE_STATUS_OPTIONS = Object.values(ACTIVE_STATUS).map(
  ({label, value}) => ({label, value})
);

export const ACTIVE_STATUS_VALUES = Object.values(ACTIVE_STATUS).map(
  ({value}) => value
);

// Temporary region options - this will be replaced with actual data from API
export const REGION_OPTIONS = [
  {label: 'Southeast Pennsylvania', value: 'southeast-pa'},
  {label: 'South Central Pennsylvania', value: 'south-central-pa'},
  {label: 'Northeast Pennsylvania', value: 'northeast-pa'},
  {label: 'Lehigh Valley / East Pennsylvania', value: 'lehigh-valley-east-pa'},
  {label: 'North Central Pennsylvania', value: 'north-central-pa'},
  {label: 'Western Pennsylvania', value: 'western-pa'},
  {label: 'Northwest Pennsylvania', value: 'northwest-pa'},
  {label: 'Southwest / Laurel Highlands', value: 'southwest-laurel-highlands'},
];

// Phone numbers follow the HHAeXchange storage shape for every role: digits
// with an optional leading "+", at most PHONE_NUMBER_MAX_LENGTH characters.
// Formatting the phone widget adds (spaces, dashes, brackets) is stripped
// before validation. Mirrors constants/usersConstants.js on the backend.
export const PHONE_NUMBER_MAX_LENGTH = 20;

export const PHONE_NUMBER_PATTERN = /^\+?\d+$/;

export const PHONE_NUMBER_STRIP_PATTERN = /[^\d+]/g;

// An empty phone widget still emits its dial code ("+1"); that is not a number
// and collapses to null instead of failing validation.
export const BARE_DIAL_CODE_PATTERN = /^\+\d{1,3}$/;

// Preferred contact methods (shared across nurses, caregivers, etc.)
export const PREFERRED_CONTACT_METHODS = {
  email: {label: 'Email', value: 'email'},
  phone: {label: 'Phone', value: 'phone'},
  sms: {label: 'Text/SMS', value: 'sms'},
} as const;

export const PREFERRED_CONTACT_OPTIONS = Object.values(
  PREFERRED_CONTACT_METHODS
).map(({label, value}) => ({label, value}));

export const PREFERRED_CONTACT_VALUES = Object.values(
  PREFERRED_CONTACT_METHODS
).map(({value}) => value);

// Where a record came from. Every synced entity shares this two-value enum, so
// the per-role source constants alias it instead of restating it.
export const ENTITY_SOURCE = {
  manual: {
    label: 'Manual',
    value: 'MANUAL',
    color: 'secondary' as ThemeColor,
  },
  hhaExchange: {
    label: 'HHAeXchange',
    value: 'HHA_EXCHANGE',
    color: 'info' as ThemeColor,
  },
} as const;

// Date-only values are stored as midnight UTC; formatting them in a US zone
// would show the previous day.
export const DATE_ONLY_ZONE = 'utc';

// System roles matching backend SystemRole enum
export const SYSTEM_ROLES = {
  admin: {label: 'Admin', orgLabel: 'Org administrator', value: 'admin'},
  employee: {label: 'Employee', orgLabel: 'Employee', value: 'employee'},
  nurse: {label: 'Nurse', orgLabel: 'Nurse', value: 'nurse'},
  caregiver: {
    label: 'Caregiver',
    orgLabel: 'Caregiver',
    value: 'caregiver',
  },
  caseManager: {
    label: 'Case Manager',
    orgLabel: 'Case manager',
    value: 'case_manager',
  },
  superAdmin: {
    label: 'Super Admin',
    orgLabel: 'Super admin',
    value: 'super_admin',
  },
} as const;

export type SystemRoleValue =
  (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]['value'];

// Common user defaults across the application
export const USER_DEFAULTS = {
  avatarColor: 'warning' as const,
  roleColor: 'primary' as const,
  statusLabel: 'Active',
  contact: '+1 (234) 464-0600',
  address: '22F, 3rd floor, Dean Heights, NY',
} as const;

export const TABLE_PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50],
  rowHeight: 68,
  skeletonRows: 10,
} as const;

// MUI palette shade used for foreground text. Lighter palette colors (e.g.
// `warning`) need the `dark` shade to stay legible on tinted backgrounds.
/** Aria ids the shared confirmation dialog wires between title and body. */
export const CONFIRM_DIALOG_IDS = {
  TITLE: 'confirm-dialog-title',
  DESCRIPTION: 'confirm-dialog-description',
} as const;

export const PALETTE_SHADES = {
  MAIN: 'main',
  DARK: 'dark',
} as const;

export const FLAG_STATUS = {
  red: {
    color: 'error' as ThemeColor,
    textShade: PALETTE_SHADES.MAIN,
  },
  yellow: {
    color: 'warning' as ThemeColor,
    textShade: PALETTE_SHADES.DARK,
  },
  green: {
    color: 'success' as ThemeColor,
    textShade: PALETTE_SHADES.MAIN,
  },
} as const;

export const OTP_MODAL_TITLE_ID = 'otp-verification-title';

export const PANEL_CARD = {
  paddingX: 4.5,
  headerPaddingY: 3.75,
  headerGap: 2.75,
  iconTileSize: 32,
} as const;

// Width of the label gutter in the inline facts layout, wide enough for the
// longest rail label so every value starts on the same edge.
export const DETAIL_FACTS_CARD = {
  inlineLabelWidth: 116,

  // The ruled list is a long one, so its lines sit tighter than body copy.
  dividedLineHeight: 1.35,

  // Narrowest a ruled row's value may get beside its label; with less room
  // than this the value drops under the label instead of being squeezed.
  dividedValueMinWidth: 120,
} as const;

export const RECORD_HEADING = {
  avatarSize: 50,
  nameFontSize: 24,
  skeletonLines: 3,
} as const;

// The list toolbar's search box: wide enough for a name or an identifier, and
// capped so it never crowds the actions beside it.
export const DATA_TABLE = {
  searchWidth: 300,
} as const;

export const TABLE_FOOTER = {
  fontSize: '12.5px',
  arrowSize: 16,
  paddingX: 5,
  paddingY: 3.25,
  pageButtonPaddingX: 2.75,
  pageButtonPaddingY: 1.5,
} as const;

// Separates the parts of a record's identity line, wherever one is shown.
export const DETAIL_IDENTITY_SEPARATOR = ' · ';

// Luxon formats shared by more than one screen.
export const DATE_FORMATS = {
  time: 'HH:mm',

  // A calendar day with its year, e.g. "14 Mar 1942".
  day: 'dd MMM yyyy',

  // Luxon's short offset name, e.g. "EDT".
  zoneAbbreviation: 'ZZZZ',
} as const;

// Photos one upload can carry: a red flag, or one checklist answer.
export const MAX_UPLOAD_IMAGES = 5;

// Stands in for a value the record does not carry. An en dash, so a blank cell
// never reads as a rendering failure.
export const DETAIL_EMPTY_VALUE = 'N/A';

// Marks a question that must be answered before the checklist can be sent.
export const REQUIRED_MARK = '*';
