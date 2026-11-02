'use client';

import {LIST_TAB_ALL} from '@/shared/constants/listToolbar';
import {ORG_USER_ROLE_TABS} from '@/shared/constants/orgUsers';
import {SegmentedTabsProps} from '@/shared/interfaces/inputs';
import {OrgUserRoleTabsParams} from '@/shared/interfaces/orgUser';

import useTranslation from './useTranslation';

// Counts come from the API and ignore the active role, so switching tabs never
// changes the numbers beside the other tabs.
export const useOrgUserRoleTabs = ({
  role,
  tabCounts,
  onChange,
}: OrgUserRoleTabsParams): SegmentedTabsProps => {
  const {t} = useTranslation();

  // Summed from the tab counts, not the pager total, which goes stale mid-refetch.
  const allCount = ORG_USER_ROLE_TABS.reduce(
    (sum, tab) => sum + (tabCounts[tab.value] ?? 0),
    0
  );

  return {
    value: role ?? LIST_TAB_ALL,
    ariaLabel: t('orgUsers.tabs.ariaLabel'),
    options: [
      {value: LIST_TAB_ALL, label: t('orgUsers.tabs.all'), count: allCount},
      ...ORG_USER_ROLE_TABS.map((tab) => ({
        value: tab.value,
        label: t(`orgUsers.roles.${tab.value}`),
        count: tabCounts[tab.value] ?? 0,
      })),
    ],
    onChange: ({value}) =>
      onChange({role: value === LIST_TAB_ALL ? null : value}),
  };
};
