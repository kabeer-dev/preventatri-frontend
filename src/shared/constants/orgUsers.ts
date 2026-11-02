import {ThemeColor} from '@/@core/theme/types';

import {SYSTEM_ROLES} from './common';

/**
 * Presentation for the unified Users & Roles roster.
 *
 * The API returns raw enum values only, so every label, colour and tab lives
 * here. Values mirror the backend's ROSTER_ROLES / ROSTER_STATUSES.
 */
export const ORG_USER_ROLES = {
  nurse: {
    label: 'Nurse',
    value: SYSTEM_ROLES.nurse.value,
    color: 'info' as ThemeColor,
  },
  case_manager: {
    label: 'Case manager',
    value: SYSTEM_ROLES.caseManager.value,
    color: 'primary' as ThemeColor,
  },
  caregiver: {
    label: 'Caregiver',
    value: SYSTEM_ROLES.caregiver.value,
    color: 'secondary' as ThemeColor,
  },
} as const;

// Tab order follows the design: All, then Nurses, Case managers, Caregivers.
export const ORG_USER_ROLE_TABS = [
  ORG_USER_ROLES.nurse,
  ORG_USER_ROLES.case_manager,
  ORG_USER_ROLES.caregiver,
];

export const ORG_USER_ROLE_OPTIONS = ORG_USER_ROLE_TABS.map(
  ({label, value}) => ({label, value})
);

/**
 * The single status vocabulary the roster filters on.
 *
 * The three profile enums plus LOCKED_OUT, which outranks a profile status on
 * the backend. Employment only; the login side is ORG_USER_INVITATION_STATUS.
 */
export const ORG_USER_STATUS = {
  ACTIVE: {label: 'Active', value: 'ACTIVE', color: 'success' as ThemeColor},
  INACTIVE: {
    label: 'Inactive',
    value: 'INACTIVE',
    color: 'error' as ThemeColor,
  },
  LOCKED_OUT: {
    label: 'Locked out',
    value: 'LOCKED_OUT',
    color: 'error' as ThemeColor,
  },
  HOLD: {label: 'Hold', value: 'HOLD', color: 'warning' as ThemeColor},
  ON_LEAVE: {label: 'On Leave', value: 'ON_LEAVE', color: 'info' as ThemeColor},
  TERMINATED: {
    label: 'Terminated',
    value: 'TERMINATED',
    color: 'error' as ThemeColor,
  },
  REJECTED: {
    label: 'Rejected',
    value: 'REJECTED',
    color: 'error' as ThemeColor,
  },
} as const;

export const ORG_USER_STATUS_OPTIONS = Object.values(ORG_USER_STATUS).map(
  ({label, value}) => ({label, value})
);

/**
 * Where a person stands on getting a login. Mirrors the backend's
 * INVITATION_STATUSES; labels are `orgUsers.invitationStatuses.<value>`.
 */
export const ORG_USER_INVITATION_STATUS = {
  PENDING_REVIEW: {value: 'PENDING_REVIEW', color: 'warning' as ThemeColor},
  READY_TO_INVITE: {value: 'READY_TO_INVITE', color: 'info' as ThemeColor},
  INVITED: {value: 'INVITED', color: 'primary' as ThemeColor},
  EXPIRED: {value: 'EXPIRED', color: 'warning' as ThemeColor},
  ACCEPTED: {value: 'ACCEPTED', color: 'success' as ThemeColor},
  DEACTIVATED: {value: 'DEACTIVATED', color: 'secondary' as ThemeColor},
  CONFLICT: {value: 'CONFLICT', color: 'error' as ThemeColor},
} as const;

export const ORG_USER_INVITATION_STATUS_VALUES = Object.values(
  ORG_USER_INVITATION_STATUS
).map(({value}) => value);

// The only people an invitation can be sent to; the backend re-checks each one.
export const ORG_USER_INVITABLE_STATUSES: string[] = [
  ORG_USER_INVITATION_STATUS.READY_TO_INVITE.value,
  ORG_USER_INVITATION_STATUS.EXPIRED.value,
];

// Sent as `sortBy`; must match the backend's USERS_SORT_FIELDS_VALUES exactly,
// which are the dotted `.value` forms rather than the short column names.
export const ORG_USER_SORT_FIELDS = {
  firstName: 'user.firstName',
  lastName: 'user.lastName',
  email: 'user.email',
  phoneNo: 'user.phoneNo',
  role: 'role',
  createdAt: 'createdAt',
} as const;

export const ORG_USER_EMPTY_CELL = 'N/A';

export const ORG_USER_DATE_FORMAT = 'dd MMM yyyy';

// The roster endpoint's filter params, which are also the URL keys the admin
// dashboard cards deep-link with.
export const ORG_USER_FILTER_PARAMS = {
  role: 'role',
  region: 'regionId',
  status: 'status',
  source: 'source',
  invitationStatus: 'invitationStatus',
  archiveFilter: 'archiveFilter',
} as const;

// The extra "Archived" choice in the status filter's list.
export const ORG_USER_ARCHIVED_STATUS = 'ARCHIVED';

// Archive view of the roster, sent as `archiveFilter`. Mirrors the backend's
// ROSTER_ARCHIVE_FILTERS; active is the default and archived people are opt-in.
export const ORG_USER_ARCHIVE_FILTER = {
  active: 'active',
  all: 'all',
  archived: 'archived',
} as const;

// The invite drawer's single form id; whichever role form is showing takes it.
export const INVITE_USER_FORM_ID = 'invite-user-form';
