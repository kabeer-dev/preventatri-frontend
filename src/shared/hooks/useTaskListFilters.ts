'use client';

import {useMemo} from 'react';

import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {
  ListFilterFieldConfig,
  UseTaskListFiltersParams,
} from '@/shared/interfaces/listToolbar';
import {buildUnsupportedFilterFields} from '@/shared/utils/listToolbar';

import {
  useCaseManagerFilterOptions,
  usePatientFilterOptions,
} from './useFilterEntityOptions';
import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';
import useUserRole from './useUserRole';

// Follow-ups and supervisory visits share one filter shape. Status is not a
// filter here: the tabs own it. Follow-ups drop the case-manager filter (any
// care-team role can own one) and add their own fields through `extraFields`;
// visits skip the flag-type field (they filter by visit type instead).
export const useTaskListFilters = ({
  flagTypeConstant,
  i18nNamespace,
  unsupportedFields = [],
  includeCaseManager = true,
  extraFields = [],
}: UseTaskListFiltersParams) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const patientOptions = usePatientFilterOptions();

  const caseManagerOptions = useCaseManagerFilterOptions({
    enabled: isAdmin && includeCaseManager,
  });

  const fields: ListFilterFieldConfig[] = useMemo(() => {
    const base: ListFilterFieldConfig[] = [];

    if (flagTypeConstant && i18nNamespace)
      base.push({
        param: FILTER_PARAMS.flagType,
        label: t('filters.flagType'),
        icon: LIST_FILTER_ICONS.flagType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.values(flagTypeConstant).map((flag) => ({
          value: String(flag.value),
          label: t(`${i18nNamespace}.types.${flag.code}`),
        })),
      });

    base.push(
      Object.assign(
        {
          param: FILTER_PARAMS.patient,
          label: t('filters.patient'),
          icon: LIST_FILTER_ICONS.patient,
          kind: LIST_FILTER_KINDS.single,
          searchable: true,
        },
        patientOptions
      )
    );

    if (includeCaseManager)
      base.push({
        param: FILTER_PARAMS.caseManager,
        label: t('filters.caseManager'),
        icon: LIST_FILTER_ICONS.caseManager,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...caseManagerOptions,
        visible: isAdmin,
      });

    return base.concat(
      extraFields,
      buildUnsupportedFilterFields({fields: unsupportedFields, t})
    );
  }, [
    t,
    isAdmin,
    flagTypeConstant,
    i18nNamespace,
    unsupportedFields,
    includeCaseManager,
    extraFields,
    patientOptions,
    caseManagerOptions,
  ]);

  return useListToolbarFilters({fields});
};
