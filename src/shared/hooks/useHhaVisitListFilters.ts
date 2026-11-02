'use client';

import {useMemo} from 'react';

import {FILTER_PARAMS} from '@/shared/constants/general';
import {HHA_VISIT_TYPE} from '@/shared/constants/hhaVisits';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';

import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';

// Status is carried by the tabs, so visit type is the only filter.
export const useHhaVisitListFilters = () => {
  const {t} = useTranslation();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.visitType,
        label: t('filters.visitType'),
        icon: LIST_FILTER_ICONS.visitType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(HHA_VISIT_TYPE).map((visitType) => ({
          value: visitType.value,
          label: t(visitType.labelKey),
        })),
      },
    ],
    [t]
  );

  return useListToolbarFilters({fields});
};
