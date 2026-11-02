import {ThemeColor} from '@/@core/theme/types';

export const PATIENT_STATUS = {
  active: {
    label: 'Active',
    value: 'active',
    color: 'success' as ThemeColor,
  },
  waiting: {
    label: 'Waiting',
    value: 'waiting',
    color: 'info' as ThemeColor,
  },
  hospitalized: {
    label: 'Hospitalized',
    value: 'hospitalized',
    color: 'primary' as ThemeColor,
  },
  discharged: {
    label: 'Discharged',
    value: 'discharged',
    color: 'secondary' as ThemeColor,
  },
  hold: {
    label: 'Hold',
    value: 'hold',
    color: 'warning' as ThemeColor,
  },
  archived: {
    label: 'Archived',
    value: 'archived',
    color: 'error' as ThemeColor,
  },
} as const;

export const PATIENT_CURRENT_STATUSES = [
  PATIENT_STATUS.active,
  PATIENT_STATUS.waiting,
  PATIENT_STATUS.hospitalized,
  PATIENT_STATUS.discharged,
  PATIENT_STATUS.hold,
] as const;

export const PATIENT_STATUS_OPTIONS = Object.values(PATIENT_STATUS).map(
  ({label, value}) => ({label, value})
);

/**
 * Where a patient record came from. Values are UPPERCASE to match the backend
 * PatientSource enum exactly — the API returns the raw enum and the frontend
 * owns the label and colour. (PATIENT_STATUS above uses lowercase values, which
 * is pre-existing drift; do not copy it here.)
 */
/**
 * Fields HHAeXchange owns on an imported patient, named as they appear in the
 * API PAYLOAD.
 *
 * Mirrors HHA_MANAGED_PATIENT_FIELDS on the backend, which rejects a payload
 * containing any of them for an HHA-sourced patient -- and rejects on PRESENCE,
 * not on change. Disabled inputs still submit through react-hook-form, so these
 * keys must be stripped from the update payload entirely; otherwise editing a
 * patient's secondary nurse or notes 400s on fields the user never touched.
 */
export const HHA_MANAGED_PATIENT_PAYLOAD_FIELDS = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'gender',
  'status',
  'address',
  'city',
  'state',
  'zipCode',
  'phoneNo',
  'emergencyContact',
  'medicaidId',
];

// Managed while HHAeXchange's nurse holds the patient (isPatientPrimaryNurseLocked).
export const HHA_MANAGED_PATIENT_LINK_PAYLOAD_FIELDS = [
  'primaryNurseProfileId',
];

// Managed only while isCountyHhaManaged (the ZIP resolved to a county).
export const HHA_DERIVED_PATIENT_PAYLOAD_FIELDS = ['countyId'];

export const PATIENT_SOURCE = {
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

// Assignment frequency options
export const ASSIGNMENT_FREQUENCY_OPTIONS = [
  {label: 'Daily', value: 'DAILY'},
  {label: 'Weekly', value: 'WEEKLY'},
  {label: 'Monthly', value: 'MONTHLY'},
];

export const ASSIGNMENT_DATE_FORMAT = 'MMM dd, yyyy';

export const PATIENT_DRAWER_STEPS = {
  details: 'details',
  careTeam: 'careTeam',
} as const;

export const PATIENT_DRAWER_STEP_ORDER = [
  PATIENT_DRAWER_STEPS.details,
  PATIENT_DRAWER_STEPS.careTeam,
] as const;

export const PATIENT_CARE_TEAM_FORM_FIELDS = [
  'primaryNurseProfileId',
  'secondaryNurseProfileId',
  'caseManagerProfileId',
];

export const PATIENT_DRAWER_FORM_IDS = {
  details: 'patient-details-form',
  careTeam: 'patient-care-team-form',
} as const;

// PA county options (grouped by region for reference)
export const COUNTY_OPTIONS = [
  // Southeast PA
  {label: 'Bucks', value: 'bucks'},
  {label: 'Chester', value: 'chester'},
  {label: 'Delaware', value: 'delaware'},
  {label: 'Montgomery', value: 'montgomery'},
  {label: 'Philadelphia', value: 'philadelphia'},

  // South Central PA
  {label: 'Adams', value: 'adams'},
  {label: 'Cumberland', value: 'cumberland'},
  {label: 'Dauphin', value: 'dauphin'},
  {label: 'Franklin', value: 'franklin'},
  {label: 'Lancaster', value: 'lancaster'},
  {label: 'Lebanon', value: 'lebanon'},
  {label: 'Perry', value: 'perry'},
  {label: 'York', value: 'york'},

  // Northeast PA
  {label: 'Carbon', value: 'carbon'},
  {label: 'Lackawanna', value: 'lackawanna'},
  {label: 'Luzerne', value: 'luzerne'},
  {label: 'Monroe', value: 'monroe'},
  {label: 'Pike', value: 'pike'},
  {label: 'Schuylkill', value: 'schuylkill'},
  {label: 'Susquehanna', value: 'susquehanna'},
  {label: 'Wayne', value: 'wayne'},
  {label: 'Wyoming', value: 'wyoming'},

  // Lehigh Valley / East PA
  {label: 'Berks', value: 'berks'},
  {label: 'Lehigh', value: 'lehigh'},
  {label: 'Northampton', value: 'northampton'},

  // North Central PA
  {label: 'Centre', value: 'centre'},
  {label: 'Clinton', value: 'clinton'},
  {label: 'Columbia', value: 'columbia'},
  {label: 'Lycoming', value: 'lycoming'},
  {label: 'Montour', value: 'montour'},
  {label: 'Northumberland', value: 'northumberland'},
  {label: 'Snyder', value: 'snyder'},
  {label: 'Sullivan', value: 'sullivan'},
  {label: 'Tioga', value: 'tioga'},
  {label: 'Union', value: 'union'},

  // Western PA
  {label: 'Allegheny', value: 'allegheny'},
  {label: 'Armstrong', value: 'armstrong'},
  {label: 'Beaver', value: 'beaver'},
  {label: 'Butler', value: 'butler'},
  {label: 'Fayette', value: 'fayette'},
  {label: 'Greene', value: 'greene'},
  {label: 'Indiana', value: 'indiana'},
  {label: 'Lawrence', value: 'lawrence'},
  {label: 'Mercer', value: 'mercer'},
  {label: 'Washington', value: 'washington'},
  {label: 'Westmoreland', value: 'westmoreland'},

  // Northwest PA
  {label: 'Cameron', value: 'cameron'},
  {label: 'Clarion', value: 'clarion'},
  {label: 'Crawford', value: 'crawford'},
  {label: 'Elk', value: 'elk'},
  {label: 'Erie', value: 'erie'},
  {label: 'Forest', value: 'forest'},
  {label: 'Jefferson', value: 'jefferson'},
  {label: 'McKean', value: 'mckean'},
  {label: 'Potter', value: 'potter'},
  {label: 'Venango', value: 'venango'},
  {label: 'Warren', value: 'warren'},

  // Southwest / Laurel Highlands
  {label: 'Bedford', value: 'bedford'},
  {label: 'Blair', value: 'blair'},
  {label: 'Cambria', value: 'cambria'},
  {label: 'Fulton', value: 'fulton'},
  {label: 'Huntingdon', value: 'huntingdon'},
  {label: 'Juniata', value: 'juniata'},
  {label: 'Mifflin', value: 'mifflin'},
  {label: 'Somerset', value: 'somerset'},
];

// Gender options matching backend GENDERS enum
export const PATIENT_GENDER = {
  male: {label: 'Male', value: 'MALE'},
  female: {label: 'Female', value: 'FEMALE'},
  other: {label: 'Other', value: 'OTHER'},
} as const;

export const PATIENT_GENDER_OPTIONS = Object.values(PATIENT_GENDER).map(
  ({label, value}) => ({label, value})
);

// Default values for display
export const PATIENT_DEFAULTS = {
  status: PATIENT_STATUS.active.value,
} as const;

// List query param keys for the archive (soft-delete) view and status filters
export const PATIENT_LIST_PARAMS = {
  archiveFilter: 'archiveFilter',
  status: 'status',
} as const;

/**
 * Response shape the patients list returns; omit the param for the full record.
 * - `minimal`: id, firstName, lastName. For pickers and filters that just name
 *   a patient.
 * - `summary`: minimal plus dateOfBirth, gender, phoneNo, diagnoses and
 *   county.name. For search results and read-only lists that identify a
 *   patient without editing them.
 * - `table`: summary plus region, nurse names, status, source, lastFlag
 *   and deletedAt. What the patients table shows; the edit drawer fetches the
 *   full record by id instead of reading the row.
 */
export const PATIENT_LIST_VIEWS = {
  minimal: 'minimal',
  summary: 'summary',
  table: 'table',
} as const;

export const PATIENT_MINIMAL_VIEW_PARAMS = {view: PATIENT_LIST_VIEWS.minimal};

export const PATIENT_SUMMARY_VIEW_PARAMS = {view: PATIENT_LIST_VIEWS.summary};

export const PATIENT_TABLE_VIEW_PARAMS = {view: PATIENT_LIST_VIEWS.table};

// Archive (soft-delete) view filter options for the patients table.
// active   -> only active patients (default)
// all      -> active + archived patients
// archived -> only archived (soft-deleted) patients
export const PATIENT_ARCHIVE_FILTER = {
  active: 'active',
  all: 'all',
  archived: 'archived',
} as const;

export type PatientArchiveFilter =
  (typeof PATIENT_ARCHIVE_FILTER)[keyof typeof PATIENT_ARCHIVE_FILTER];

/**
 * Which reading of the patients table is on screen.
 *
 * The caregiver variant is the same table with the office's columns and actions
 * left out and the one thing she acts on added: what each patient owes today.
 */
/**
 * Which reading of a patient screen to render: the office's, or the
 * caregiver's cut of the same list and the same record.
 */
export const PATIENT_VIEW_VARIANT = {
  admin: 'admin',
  caregiver: 'caregiver',
} as const;

export type PatientViewVariant =
  (typeof PATIENT_VIEW_VARIANT)[keyof typeof PATIENT_VIEW_VARIANT];

// Theme color for each event in the patient activity timeline, so the history
// reads at a glance (flags by severity, completions as success, etc.).
export const PATIENT_TIMELINE_COLORS: Record<string, ThemeColor> = {
  PATIENT_ADDED: 'primary',
  PATIENT_UPDATED: 'secondary',
  ASSIGNMENT_CREATED: 'info',
  ASSIGNMENT_REMOVED: 'secondary',
  ASSESSMENT_SUBMITTED: 'success',
  FOLLOW_UP_TASK_CREATED: 'info',
  FOLLOW_UP_TASK_COMPLETED: 'success',
  SUPERVISORY_VISIT_SCHEDULED: 'info',
  SUPERVISORY_VISIT_COMPLETED: 'success',
};

// FLAG_RAISED and FLAG_RESOLVED take their color from the flag's severity.
export const PATIENT_TIMELINE_FLAG_COLORS: Record<string, ThemeColor> = {
  RED: 'error',
  YELLOW: 'warning',
  GREEN: 'success',
};

// Layout of the patient history card. The date gutter matches the alert
// history so the two histories line up.
export const PATIENT_TIMELINE_DATE_COLUMN_WIDTH = 52;

export const PATIENT_TIMELINE_MAX_HEIGHT = 480;

// Rows shown as placeholders while a page is on its way.
export const PATIENT_TIMELINE_SKELETON_ROWS = 3;

// Events whose label and color depend on the flag they are about.
export const PATIENT_TIMELINE_FLAG_EVENT_TYPES = [
  'FLAG_RAISED',
  'FLAG_RESOLVED',
];
