import {ACTIVE_STATUS} from './common';

// Default values for display
export const REGION_DEFAULTS = {
  status: ACTIVE_STATUS.active.value,
} as const;

// Tab values for the regions page; the query each one sends is in
// REGION_LIST_TABS.
export const REGION_TAB = {
  all: 'all',
  active: 'active',
  inactive: 'inactive',
  archived: 'archived',
} as const;

// Query params the regions list endpoint filters on.
export const REGION_LIST_PARAMS = {
  archiveFilter: 'archiveFilter',
  isActive: 'isActive',
} as const;

export const REGION_CARD = {
  iconTileSize: 36,
} as const;
