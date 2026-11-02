'use client';

import {REGION_LIST_TABS} from '@/shared/constants/listToolbarTabs';
import {REGION_TAB} from '@/shared/constants/regions';

import {useListTabs} from './useListTabs';
import useTranslation from './useTranslation';

// The regions page's status tabs. Archived regions are listed too (read-only),
// so the default tab is All.
export const useRegionListTabs = () => {
  const {t} = useTranslation();

  return useListTabs({
    urlKey: 'status',
    ariaLabel: t('region.tabs.ariaLabel'),
    options: REGION_LIST_TABS,
    defaultValue: REGION_TAB.all,
  });
};
