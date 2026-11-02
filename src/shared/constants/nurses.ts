import {ThemeColor} from '@/@core/theme/types';
import {ENTITY_SOURCE} from '@/shared/constants/common';
import {US_STATES} from '@/shared/constants/usStates';

// Professional roles matching backend ProfessionalRole enum
export const PROFESSIONAL_ROLES = {
  RN: {label: 'RN (Registered Nurse)', value: 'RN'},
  LPN: {label: 'LPN (Licensed Practical Nurse)', value: 'LPN'},
} as const;

export const PROFESSIONAL_ROLE_OPTIONS = Object.values(PROFESSIONAL_ROLES).map(
  ({label, value}) => ({label, value})
);

export const PROFESSIONAL_ROLE_VALUES = Object.values(PROFESSIONAL_ROLES).map(
  ({value}) => value
);

// Matches the backend default (NURSE_DEFAULT_LICENSE_STATE).
export const DEFAULT_LICENSE_STATE = 'PA';

export const LICENSE_STATE_OPTIONS = Object.entries(US_STATES).map((entry) => ({
  label: `${entry[0]} (${entry[1]})`,
  value: entry[0],
}));

export const LICENSE_STATE_VALUES = LICENSE_STATE_OPTIONS.map(
  ({value}) => value
);

// NurseRegion role discriminator — mirrors backend constants/nursesConstants.js
export const NURSE_REGION_ROLES = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
} as const;

export type NurseRegionRole =
  (typeof NURSE_REGION_ROLES)[keyof typeof NURSE_REGION_ROLES];

// Default values for display
export const NURSE_DEFAULTS = {
  assignedAlerts: 0,
  highAlerts: 0,
} as const;

// Avg-response-time chip color bands, in seconds. The first band the value falls
// within wins. Derived from the nurse-level escalation TTLs in the backend's
// escalationConstants.js (ESCALATION_LEVELS.ttlMinutes = {RED: 3, YELLOW: 5}):
// green = the nurse averages within the tightest (RED) SLA, amber = within the
// looser (YELLOW) one, red = beyond both, by which point the alert would already
// have escalated past them. Cross-repo constant — keep in sync if the TTLs move.
//
// NOTE: lower is better here, unlike percentage KPIs where higher is better.
// Do not reuse a higher-is-better color resolver, or the color meaning inverts.
//
// TODO: these thresholds (180/300s) will change. The RED- and YELLOW-flag
// escalation times are being revised, so keep these bands in sync with the
// updated TTLs — see the escalation time constants in the backend
// (escalationConstants.js ESCALATION_LEVELS.ttlMinutes) and any related
// frontend time constants once they are updated.
export const RESP_TIME_CHIP_BANDS: {maxSeconds: number; color: ThemeColor}[] = [
  {maxSeconds: 180, color: 'success'},
  {maxSeconds: 300, color: 'warning'},
  {maxSeconds: Infinity, color: 'error'},
];

// Chip color when the nurse has never resolved an escalation (null average):
// neutral, not green, because "no data" is not "fast".
export const RESP_TIME_EMPTY_COLOR: ThemeColor = 'secondary';

/**
 * Where a nurse record came from.
 *
 * Mirrors NURSE_SOURCES on the backend and the NurseSource Postgres enum.
 * HHAeXchange has no nurse feed of its own: an imported nurse is a caregiver-feed
 * record the GetNurses roster claims, but on screen it is simply "HHAeXchange".
 */
export const NURSE_SOURCE = ENTITY_SOURCE;

/**
 * Fields HHAeXchange owns on an imported nurse, named as they appear in the API
 * PAYLOAD.
 *
 * Mirrors HHA_MANAGED_NURSE_FIELDS on the backend, which rejects a payload
 * containing any of them for an HHA-sourced nurse -- on PRESENCE, not on change.
 * Disabled inputs still submit their values through react-hook-form, so the
 * update payload must have these keys stripped out entirely.
 *
 * licenseState, licenseExpirationDate, secondary regions, onCallIndicator,
 * preferredContactMethod, joiningDate and notes are PreventaTri-owned and stay
 * editable -- the licence expiration date in particular, because HHAeXchange
 * never publishes one and an admin fills it in during review. Primary regions
 * follow HHA_DERIVED_NURSE_PAYLOAD_FIELDS.
 *
 * `email` is absent on purpose -- it follows HHAeXchange when HHA has one, and
 * stays editable while it is still the generated placeholder.
 */
export const HHA_MANAGED_NURSE_PAYLOAD_FIELDS = [
  'firstName',
  'lastName',
  'phoneNo',
  'address',
  'city',
  'state',
  'zipCode',
  'professionalRole',
  'status',
  'licenseNumber',
  'npi',
];

// Managed only while isPrimaryRegionHhaManaged (the address resolved).
export const HHA_DERIVED_NURSE_PAYLOAD_FIELDS = ['primaryRegionIds'];
