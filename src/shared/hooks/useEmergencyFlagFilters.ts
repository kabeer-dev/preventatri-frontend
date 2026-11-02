'use client';

import {useMemo} from 'react';

import {EMERGENCY_FLAG_FILTER_LABEL_KEYS} from '@/shared/constants/flag';
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
import {useRegionFilterField} from './useRegionFilterField';
import useTranslation from './useTranslation';
import useUserRole from './useUserRole';

// Status is not a filter here: the alert tabs own it.
export const useEmergencyFlagFilters = () => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const patientOptions = usePatientFilterOptions();
  const caregiverOptions = useCaregiverFilterOptions({enabled: isAdmin});
  const regionField = useRegionFilterField();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.flag,
        label: t('filters.severity'),
        icon: LIST_FILTER_ICONS.severity,
        kind: LIST_FILTER_KINDS.single,
        options: Object.entries(EMERGENCY_FLAG_FILTER_LABEL_KEYS).map(
          ([value, labelKey]) => ({value, label: t(labelKey)})
        ),
      },
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
      regionField,
    ],
    [t, isAdmin, patientOptions, caregiverOptions, regionField]
  );

  return useListToolbarFilters({fields});
};
