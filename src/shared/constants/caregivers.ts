import {ThemeColor} from '@/@core/theme/types';
import {ENTITY_SOURCE} from '@/shared/constants/common';

// Caregiver roles (lookup by value)
export const CAREGIVER_ROLES = {
  PCA: {label: 'PCA (Personal Care Assistant)', value: 'PCA'},
  HHA: {label: 'HHA (Home Health Aide)', value: 'HHA'},
  FAMILY: {label: 'Family Caregiver', value: 'FAMILY'},
} as const;

export const CAREGIVER_ROLE_OPTIONS = Object.values(CAREGIVER_ROLES).map(
  ({label, value}) => ({label, value})
);

// Relationship to patient (lookup by value)
export const RELATIONSHIPS = {
  family: {label: 'Family', value: 'family'},
  staff: {label: 'Staff', value: 'staff'},
} as const;

export const RELATIONSHIP_OPTIONS = Object.values(RELATIONSHIPS).map(
  ({label, value}) => ({label, value})
);

/**
 * Caregiver lifecycle statuses.
 *
 * Six values, mirroring the CaregiverStatus Postgres enum and the six statuses
 * HHAeXchange exposes, so an imported caregiver renders with the status the
 * agency actually set rather than falling through to a wrong label.
 *
 * Deliberately NOT the shared ACTIVE_STATUS in constants/common: that two-value
 * map is used by nurses, case managers and regions, whose backends only have
 * two statuses. Widening it would offer HOLD / ON_LEAVE / TERMINATED / REJECTED
 * on entities that cannot store them.
 *
 * Values are LOWERCASE because that is the convention the caregiver screens
 * already follow -- the API sends 'ON_LEAVE', the table and the form lowercase
 * it on the way in, and caregiverUtils uppercases it on the way back out.
 */
export const CAREGIVER_STATUS = {
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
  hold: {
    label: 'Hold',
    value: 'hold',
    color: 'warning' as ThemeColor,
  },
  on_leave: {
    label: 'On Leave',
    value: 'on_leave',
    color: 'info' as ThemeColor,
  },
  terminated: {
    label: 'Terminated',
    value: 'terminated',
    color: 'error' as ThemeColor,
  },
  rejected: {
    label: 'Rejected',
    value: 'rejected',
    color: 'secondary' as ThemeColor,
  },
} as const;

export const CAREGIVER_STATUS_OPTIONS = Object.values(CAREGIVER_STATUS).map(
  ({label, value}) => ({label, value})
);

export const CAREGIVER_STATUS_VALUES = Object.values(CAREGIVER_STATUS).map(
  ({value}) => value
);

/**
 * Where a caregiver record came from. Mirrors PATIENT_SOURCE, including its
 * UPPERCASE values -- these are compared against the API response verbatim.
 *
 * An HHA_EXCHANGE caregiver has its HHAeXchange-managed fields greyed out in
 * the form: the nightly sync overwrites them, so an edit made here would vanish.
 */
export const CAREGIVER_SOURCE = ENTITY_SOURCE;

/**
 * Fields HHAeXchange owns on an imported caregiver, named as they appear in the
 * API PAYLOAD (so `role`, not the form's `caregiverRole`).
 *
 * Mirrors HHA_MANAGED_CAREGIVER_FIELDS on the backend, which rejects a payload
 * containing any of them for an HHA-sourced caregiver -- and rejects on
 * PRESENCE, not on change. Disabled inputs still submit their values through
 * react-hook-form, so the update payload must have these keys stripped out
 * entirely; without that, editing a caregiver's notes would 400 on the fields
 * the user never touched.
 *
 * `email` is absent on purpose -- it follows HHAeXchange when HHA has one, and
 * stays editable while it is still the generated placeholder.
 */
export const HHA_MANAGED_CAREGIVER_PAYLOAD_FIELDS = [
  'firstName',
  'lastName',
  'phoneNo',
  'address',
  'city',
  'state',
  'zipCode',
  'role',
  'status',
  'language',
  'startDate',
  'terminationDate',
];

/**
 * Language options (lookup by value).
 *
 * Codes, not display names: the column is VarChar(10) and stores a code. The
 * list is wider than the five PreventaTri shipped with because HHAeXchange
 * caregivers carry the agency's own language list, and a language with no entry
 * here imports as null. It mirrors HHAX_LANGUAGE_NAME_MAP on the backend, which
 * is what turns an HHAeXchange language name into one of these codes.
 */
export const LANGUAGES = {
  en: {label: 'English', value: 'en'},
  es: {label: 'Spanish', value: 'es'},
  zh: {label: 'Mandarin', value: 'zh'},
  yue: {label: 'Cantonese', value: 'yue'},
  vi: {label: 'Vietnamese', value: 'vi'},
  ko: {label: 'Korean', value: 'ko'},
  ru: {label: 'Russian', value: 'ru'},
  fr: {label: 'French', value: 'fr'},
  ht: {label: 'Haitian Creole', value: 'ht'},
  ar: {label: 'Arabic', value: 'ar'},
  bn: {label: 'Bengali', value: 'bn'},
  hi: {label: 'Hindi', value: 'hi'},
  ur: {label: 'Urdu', value: 'ur'},
  pl: {label: 'Polish', value: 'pl'},
  it: {label: 'Italian', value: 'it'},
  pt: {label: 'Portuguese', value: 'pt'},
  tl: {label: 'Tagalog', value: 'tl'},
  sq: {label: 'Albanian', value: 'sq'},
  he: {label: 'Hebrew', value: 'he'},
  yi: {label: 'Yiddish', value: 'yi'},
  ja: {label: 'Japanese', value: 'ja'},
  el: {label: 'Greek', value: 'el'},
  de: {label: 'German', value: 'de'},
  uk: {label: 'Ukrainian', value: 'uk'},
  ro: {label: 'Romanian', value: 'ro'},
  pa: {label: 'Punjabi', value: 'pa'},
  ne: {label: 'Nepali', value: 'ne'},
  so: {label: 'Somali', value: 'so'},
  am: {label: 'Amharic', value: 'am'},
  sw: {label: 'Swahili', value: 'sw'},
  tr: {label: 'Turkish', value: 'tr'},
  th: {label: 'Thai', value: 'th'},
  fa: {label: 'Farsi', value: 'fa'},
  hy: {label: 'Armenian', value: 'hy'},
  ka: {label: 'Georgian', value: 'ka'},
  uz: {label: 'Uzbek', value: 'uz'},
  nl: {label: 'Dutch', value: 'nl'},
} as const;

export const LANGUAGE_OPTIONS = Object.values(LANGUAGES).map(
  ({label, value}) => ({label, value})
);

export const LANGUAGE_VALUES = Object.values(LANGUAGES).map(({value}) => value);

// Default values for display
export const CAREGIVER_DEFAULTS = {
  assignedPatients: 0,
  redFlags: 0,
  lastActive: 'Never',
  status: CAREGIVER_STATUS.inactive.value,
} as const;
