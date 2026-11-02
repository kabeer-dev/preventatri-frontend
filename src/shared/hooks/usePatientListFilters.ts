'use client';

import {useMemo} from 'react';

import {EMERGENCY_FLAG_FILTER_LABEL_KEYS} from '@/shared/constants/flag';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {PATIENT_SOURCE} from '@/shared/constants/patients';
import {
  FilterEntityOptionsParams,
  ListFilterFieldConfig,
} from '@/shared/interfaces/listToolbar';

import {useNurseFilterOptions} from './useFilterEntityOptions';
import {useListToolbarFilters} from './useListToolbarFilters';
import {useRegionFilterField} from './useRegionFilterField';
import useTranslation from './useTranslation';

export const usePatientListFilters = ({
  enabled,
}: FilterEntityOptionsParams = {}) => {
  const {t} = useTranslation();
  const regionField = useRegionFilterField({enabled});

  const nurseOptions = useNurseFilterOptions({
    enabled,
    valueField: 'profileId',
  });

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      regionField,
      {
        param: FILTER_PARAMS.nurseProfile,
        label: t('filters.careTeam'),
        icon: LIST_FILTER_ICONS.careTeam,
        kind: LIST_FILTER_KINDS.multi,
        searchable: true,
        ...nurseOptions,
      },
      {
        param: FILTER_PARAMS.lastFlag,
        label: t('filters.severity'),
        icon: LIST_FILTER_ICONS.severity,
        kind: LIST_FILTER_KINDS.single,
        options: Object.entries(EMERGENCY_FLAG_FILTER_LABEL_KEYS).map(
          ([value, labelKey]) => ({value, label: t(labelKey)})
        ),
      },
      {
        param: FILTER_PARAMS.source,
        label: t('filters.source'),
        icon: LIST_FILTER_ICONS.source,
        kind: LIST_FILTER_KINDS.multi,
        options: Object.entries(PATIENT_SOURCE).map(([key, source]) => ({
          value: source.value,
          label: t(`patients.source.${key}`),
        })),
      },
    ],
    [t, regionField, nurseOptions]
  );

  return useListToolbarFilters({fields});
};
