'use client';

import {useMemo} from 'react';

import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';

import {
  useCaregiverFilterOptions,
  usePatientFilterOptions,
} from './useFilterEntityOptions';
import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';
import useUserRole from './useUserRole';

// Status is chosen by the list tabs, so it is not offered as a filter.
export const useSubmissionFilters = () => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const patientOptions = usePatientFilterOptions();
  const caregiverOptions = useCaregiverFilterOptions({enabled: isAdmin});

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.patient,
        label: t('filters.patient'),
        icon: LIST_FILTER_ICONS.patient,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...patientOptions,
      },
      {
        param: FILTER_PARAMS.caregiver,
        label: t('filters.caregiver'),
        icon: LIST_FILTER_ICONS.caregiver,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...caregiverOptions,
        visible: isAdmin,
      },
    ],
    [t, isAdmin, patientOptions, caregiverOptions]
  );

  return useListToolbarFilters({fields});
};
