export const LIST_FILTER_KINDS = {
  multi: 'multi',
  single: 'single',
} as const;

// Keyed by what a filter narrows on, so a subject looks the same on every list.
export const LIST_FILTER_ICONS = {
  status: 'mdi:list-status',
  source: 'mdi:database-import-outline',
  invitation: 'mdi:email-outline',
  region: 'mdi:map-marker-outline',
  patient: 'mdi:account-heart-outline',
  caregiver: 'mdi:hand-heart-outline',
  caseManager: 'mdi:briefcase-account-outline',
  nurse: 'mdi:stethoscope',
  careTeam: 'mdi:account-group-outline',
  assignee: 'mdi:account-arrow-right-outline',
  severity: 'mdi:alert-outline',
  flagType: 'mdi:flag-outline',
  checklistType: 'mdi:clipboard-list-outline',
  visitType: 'mdi:home-clock-outline',
  actionType: 'mdi:lightning-bolt-outline',
  resourceType: 'mdi:file-document-outline',
} as const;

// Multi value params are comma joined, the form the list endpoints already accept.
export const LIST_FILTER_VALUE_SEPARATOR = ',';

export const LIST_TAB_ALL = 'all';

export const LIST_TAB_URL_KEY = 'tab';

// Params for filters the design shows but no endpoint accepts yet. They only
// ever render disabled, so they never reach the URL or the API.
export const UNSUPPORTED_FILTER_PARAMS = {
  region: 'region',
  assignee: 'assignee',
  source: 'source',
} as const;

export const LIST_TOOLBAR = {
  popoverWidth: 468,
  popoverElevation: 8,
  fieldListWidth: 204,
  optionsMaxHeight: 236,
  chipValuesShown: 2,
} as const;
