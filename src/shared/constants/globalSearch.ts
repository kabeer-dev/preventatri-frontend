import {ComponentType} from 'react';

import {ThemeColor} from '@/@core/theme/types';
import {
  CaregiversIcon,
  CaseManagersIcon,
  NursesIcon,
  PatientsIcon,
} from '@/shared/components/icons';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {IconProps} from '@/shared/interfaces/common';
import {SearchResultType} from '@/shared/types/search';

export const TOP_BAR_SEARCH_WIDTH = 320;

export const SEARCH_RESULTS_ID = 'top-bar-search-results';

export const SEARCH_RESULT_CHIP_SIZE = 36;

export const SEARCH_RESULT_ICON_SIZE = 20;

export const GLOBAL_SEARCH_MIN_CHARS = 2;

export const GLOBAL_SEARCH_RESULTS_LIMIT = 5;

export const GLOBAL_SEARCH_DEBOUNCE_MS = 300;

export const GLOBAL_SEARCH_LOADER_SIZE = 20;

// Staff types reuse the API's role values so a roster row maps without translation.
export const SEARCH_RESULT_TYPES = {
  patient: 'patient',
  nurse: SYSTEM_ROLES.nurse.value,
  caregiver: SYSTEM_ROLES.caregiver.value,
  caseManager: SYSTEM_ROLES.caseManager.value,
} as const;

export const SEARCH_SUBTITLE_SEPARATOR = ' / ';

// Every detail page is keyed on the role profile id, not the user id.
export const DETAIL_ROUTE_BY_TYPE: Record<
  SearchResultType,
  ({id}: {id: string | number}) => string
> = {
  [SEARCH_RESULT_TYPES.patient]: DASHBOARD_ROUTES.patients.single,
  [SEARCH_RESULT_TYPES.nurse]: DASHBOARD_ROUTES.nurses.single,
  [SEARCH_RESULT_TYPES.caregiver]: DASHBOARD_ROUTES.caregivers.single,
  [SEARCH_RESULT_TYPES.caseManager]: DASHBOARD_ROUTES.caseManagers.single,
};

export const SEARCH_RESULT_ICONS: Record<
  SearchResultType,
  ComponentType<IconProps>
> = {
  [SEARCH_RESULT_TYPES.patient]: PatientsIcon,
  [SEARCH_RESULT_TYPES.nurse]: NursesIcon,
  [SEARCH_RESULT_TYPES.caregiver]: CaregiversIcon,
  [SEARCH_RESULT_TYPES.caseManager]: CaseManagersIcon,
};

// Staff colours come from ORG_USER_ROLES; success keeps patients off the case-manager hue.
export const PATIENT_SEARCH_RESULT_COLOR: ThemeColor = 'success';
