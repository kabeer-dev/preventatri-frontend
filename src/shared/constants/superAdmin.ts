import {ThemeColor} from '@/@core/theme/types';
import {
  OrganizationAction,
  OrganizationStatus,
} from '@/shared/types/superAdmin';

export const ORGANIZATION_STATUS: Record<
  OrganizationStatus,
  {value: OrganizationStatus; color: ThemeColor}
> = {
  pending: {value: 'pending', color: 'warning'},
  active: {value: 'active', color: 'success'},
  suspended: {value: 'suspended', color: 'error'},
  rejected: {value: 'rejected', color: 'secondary'},
};

// Order of the status tabs; the first one is the default.
export const ORGANIZATION_STATUS_TABS: OrganizationStatus[] = [
  'pending',
  'active',
  'suspended',
  'rejected',
];

export const ORGANIZATION_TAB_ALL = 'all';

// The actions each status offers, in the order their buttons are shown.
export const ORGANIZATION_STATUS_ACTIONS: Record<
  OrganizationStatus,
  OrganizationAction[]
> = {
  pending: ['approve', 'reject'],
  active: ['suspend'],
  suspended: ['reactivate'],
  rejected: [],
};

// Reject and suspend take an optional reason; the others only confirm.
export const ORGANIZATION_REASON_ACTIONS: OrganizationAction[] = [
  'reject',
  'suspend',
];

export const ORGANIZATION_REASON_MAX_LENGTH = 1000;

export const ORGANIZATION_DATE_FORMAT = 'dd MMM yyyy';

export const ORGANIZATION_EMPTY_CELL = '-';
