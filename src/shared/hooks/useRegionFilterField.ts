'use client';

import {useMemo} from 'react';

import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {
  FilterEntityOptionsParams,
  ListFilterFieldConfig,
} from '@/shared/interfaces/listToolbar';

import {useRegionFilterOptions} from './useFilterEntityOptions';
import useTranslation from './useTranslation';

export const useRegionFilterField = ({
  enabled,
}: FilterEntityOptionsParams = {}): ListFilterFieldConfig => {
  const {t} = useTranslation();
  const regionOptions = useRegionFilterOptions({enabled});

  return useMemo(
    () => ({
      param: FILTER_PARAMS.region,
      label: t('filters.region'),
      icon: LIST_FILTER_ICONS.region,
      kind: LIST_FILTER_KINDS.multi,
      searchable: true,
      ...regionOptions,
    }),
    [t, regionOptions]
  );
};
