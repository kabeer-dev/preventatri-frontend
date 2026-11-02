'use client';

import {useEffect, useMemo} from 'react';

import {ENTITY_STATUS} from '@/shared/constants/general';
import {PATIENT_MINIMAL_VIEW_PARAMS} from '@/shared/constants/patients';
import {
  CAREGIVERS,
  CASE_MANAGERS,
  NURSES,
  PATIENTS,
  REGIONS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {
  EntityFilterOptionsParams,
  FilterCaregiverSource,
  FilterCaseManagerSource,
  FilterEntityOptionsParams,
  FilterPatientSource,
  ListFilterOption,
  NurseFilterOptionsParams,
  RegionFilterOptionsParams,
  SearchableFilterOptions,
  UseCaseManagerOptionsParams,
} from '@/shared/interfaces/listToolbar';
import {EligibleNurse} from '@/shared/interfaces/nurse';
import {Region} from '@/shared/interfaces/region';
import {getFullName} from '@/shared/utils/general';

const PATIENT_FILTER_PARAMS = {
  ...PATIENT_MINIMAL_VIEW_PARAMS,
  ...SUB_ROUTE_PARAMS,
};

const NURSE_FILTER_PARAMS = {
  status: ENTITY_STATUS.ACTIVE.value,
  isVerified: true,
  ...SUB_ROUTE_PARAMS,
};

const toPatientOption = ({row}: {row: FilterPatientSource}) => ({
  value: row.id,
  label: getFullName(row),
});

const toCaregiverOption = ({row}: {row: FilterCaregiverSource}) => ({
  value: row.caregiverId,
  label: getFullName(row.user || {}),
});

const toNurseUserOption = ({row}: {row: EligibleNurse}) => ({
  value: row.user?.id ?? '',
  label: getFullName({
    firstName: row.user?.firstName,
    lastName: row.user?.lastName,
  }),
});

const toNurseProfileOption = ({row}: {row: EligibleNurse}) => ({
  ...toNurseUserOption({row}),
  value: row.profileId,
});

const toRegionOption = ({row}: {row: Region}) => ({
  value: row.id,
  label: row.name,
});

const toLabelMap = ({options}: {options: ListFilterOption[]}) =>
  options.reduce<Record<string, string>>(
    (labels, option) => ({...labels, [option.value]: option.label}),
    {}
  );

// An applied chip has to name an id the current search may not return, so
// labels are cached outside React: they are server responses, not render state.
const seenLabels = new Map<string, Record<string, string>>();

const useRememberedLabels = ({
  cacheKey,
  options,
}: {
  cacheKey: string;
  options: ListFilterOption[];
}) => {
  useEffect(() => {
    const cached = seenLabels.get(cacheKey) || {};

    options.forEach((option) => {
      cached[option.value] = option.label;
    });

    seenLabels.set(cacheKey, cached);
  }, [cacheKey, options]);

  return useMemo(
    () => ({...seenLabels.get(cacheKey), ...toLabelMap({options})}),
    [cacheKey, options]
  );
};

// Any searchable list filter: searched and paged on the server.
export const useEntityFilterOptions = <TRow>({
  cacheKey,
  query,
  listKey,
  toOption,
  params,
  enabled = true,
}: EntityFilterOptionsParams<TRow>): SearchableFilterOptions => {
  const source = useAsyncSelectOptions({
    query,
    listKey,
    toOption,
    params,
    enabled,
  });

  const {onSearchChange, onLoadMore, isLoading, isLoadingMore, hasMore} =
    source;

  const options = useMemo(
    () => source.options.filter((option) => option.value),
    [source.options]
  );

  const knownLabels = useRememberedLabels({cacheKey, options});

  return useMemo(
    () => ({
      options,
      knownLabels,
      onQueryChange: onSearchChange,
      onLoadMore,
      isLoading,
      isLoadingMore,
      hasMore,
    }),
    [
      options,
      knownLabels,
      onSearchChange,
      onLoadMore,
      isLoading,
      isLoadingMore,
      hasMore,
    ]
  );
};

export const usePatientFilterOptions = ({
  enabled,
}: FilterEntityOptionsParams = {}) =>
  useEntityFilterOptions({
    cacheKey: 'patients',
    query: PATIENTS.fetchPatientsList,
    listKey: 'patients',
    toOption: toPatientOption,
    params: PATIENT_FILTER_PARAMS,
    enabled,
  });

export const useCaregiverFilterOptions = ({
  enabled,
}: FilterEntityOptionsParams = {}) =>
  useEntityFilterOptions({
    cacheKey: 'caregivers',
    query: CAREGIVERS.fetchCaregiversList,
    listKey: 'caregivers',
    toOption: toCaregiverOption,
    enabled,
  });

export const useNurseFilterOptions = ({
  enabled,
  valueField = 'userId',
}: NurseFilterOptionsParams = {}) =>
  useEntityFilterOptions({
    cacheKey: `nurses.${valueField}`,
    query: NURSES.fetchNursesList,
    listKey: 'nurses',
    toOption:
      valueField === 'profileId' ? toNurseProfileOption : toNurseUserOption,
    params: NURSE_FILTER_PARAMS,
    enabled,
  });

// `value` defaults to the profileId the task lists filter on; Reports asks
// for caseManagerId, the user id.
export const useCaseManagerFilterOptions = ({
  enabled,
  valueField = 'profileId',
}: UseCaseManagerOptionsParams) => {
  const toOption = useMemo(
    () =>
      ({row}: {row: FilterCaseManagerSource}) => ({
        value: row[valueField],
        label:
          getFullName(row.user || {}) || row.user?.email || row[valueField],
      }),
    [valueField]
  );

  return useEntityFilterOptions({
    cacheKey: `caseManagers.${valueField}`,
    query: CASE_MANAGERS.fetchCaseManagersList,
    listKey: 'caseManagers',
    toOption,
    enabled,
  });
};

export const useRegionFilterOptions = ({
  enabled,
  activeOnly = false,
}: RegionFilterOptionsParams = {}) =>
  useEntityFilterOptions({
    cacheKey: 'regions',
    query: activeOnly
      ? REGIONS.fetchActiveRegionsList
      : REGIONS.fetchRegionsList,
    listKey: 'regions',
    toOption: toRegionOption,
    params: SUB_ROUTE_PARAMS,
    enabled,
  });
