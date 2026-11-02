'use client';

import {useCallback, useEffect, useMemo} from 'react';

import {parseAsString, useQueryStates} from 'nuqs';

import {
  FILTER_PARAMS,
  ISO_DATE_PATTERN,
  UUID_PATTERN,
} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {
  REPORT_DEFAULT_RANGE_DAYS,
  REPORT_MAX_RANGE_DAYS,
  REPORT_PERSON_FILTER_PARAMS,
} from '@/shared/constants/reports';
import {
  useCaregiverFilterOptions,
  useCaseManagerFilterOptions,
  useNurseFilterOptions,
  usePatientFilterOptions,
  useRegionFilterOptions,
} from '@/shared/hooks/useFilterEntityOptions';
import {useListToolbarFilters} from '@/shared/hooks/useListToolbarFilters';
import useTranslation from '@/shared/hooks/useTranslation';
import {DateRange} from '@/shared/interfaces/inputs';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';
import {
  ReportApiParams,
  ReportCoverageParams,
  ReportScopeParams,
} from '@/shared/interfaces/reports';
import {getInclusiveDayCount, getPastDateRange} from '@/shared/utils/dateUtils';

export const useReportFilters = () => {
  const {t} = useTranslation();

  const [state, setState] = useQueryStates(
    {
      [FILTER_PARAMS.fromDate]: parseAsString.withDefault(''),
      [FILTER_PARAMS.toDate]: parseAsString.withDefault(''),
    },
    {clearOnDefault: true}
  );

  const patientOptions = usePatientFilterOptions();
  const caregiverOptions = useCaregiverFilterOptions({enabled: true});
  const nurseOptions = useNurseFilterOptions();

  const caseManagerOptions = useCaseManagerFilterOptions({
    enabled: true,
    valueField: 'caseManagerId',
  });

  const regionOptions = useRegionFilterOptions({activeOnly: true});

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.region,
        label: t('reports.filters.region'),
        icon: LIST_FILTER_ICONS.region,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...regionOptions,
      },
      Object.assign(
        {
          param: REPORT_PERSON_FILTER_PARAMS.caregiver,
          label: t('reports.filters.caregiver'),
          icon: LIST_FILTER_ICONS.caregiver,
          kind: LIST_FILTER_KINDS.single,
          searchable: true,
        },
        caregiverOptions
      ),
      {
        param: REPORT_PERSON_FILTER_PARAMS.caseManager,
        label: t('reports.filters.caseManager'),
        icon: LIST_FILTER_ICONS.caseManager,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...caseManagerOptions,
      },
      {
        param: REPORT_PERSON_FILTER_PARAMS.nurse,
        label: t('reports.filters.nurse'),
        icon: LIST_FILTER_ICONS.nurse,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...nurseOptions,
      },
      Object.assign(
        {
          param: REPORT_PERSON_FILTER_PARAMS.patient,
          label: t('reports.filters.patient'),
          icon: LIST_FILTER_ICONS.patient,
          kind: LIST_FILTER_KINDS.single,
          searchable: true,
        },
        patientOptions
      ),
    ],
    [
      t,
      regionOptions,
      caregiverOptions,
      caseManagerOptions,
      nurseOptions,
      patientOptions,
    ]
  );

  const {filterParams, toolbarFilters} = useListToolbarFilters({fields});

  const fromDate = state[FILTER_PARAMS.fromDate];
  const toDate = state[FILTER_PARAMS.toDate];

  // A hand-edited URL falls back to the default period before any request.
  const range = useMemo((): {from: string; to: string} => {
    const isReadable =
      ISO_DATE_PATTERN.test(fromDate) && ISO_DATE_PATTERN.test(toDate);

    const dayCount = isReadable
      ? getInclusiveDayCount({from: fromDate, to: toDate})
      : null;

    return dayCount !== null && dayCount - 1 <= REPORT_MAX_RANGE_DAYS
      ? {from: fromDate, to: toDate}
      : getPastDateRange({days: REPORT_DEFAULT_RANGE_DAYS});
  }, [fromDate, toDate]);

  // A hand-edited id is dropped before any request.
  const filters: ReportScopeParams = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filterParams).filter(([, value]) =>
          UUID_PATTERN.test(value)
        )
      ),
    [filterParams]
  );

  // Clear a hand-edited id from the URL too, so no chip or export title
  // claims a filter the data does not have.
  const invalidParam = Object.keys(filterParams).find(
    (param) => !UUID_PATTERN.test(filterParams[param])
  );

  const {regionId} = filters;

  const {onRemove} = toolbarFilters;

  useEffect(() => {
    if (invalidParam) onRemove({param: invalidParam});
  }, [invalidParam, onRemove]);

  const apiParams: ReportApiParams = useMemo(
    () => ({...range, ...filters}),
    [range, filters]
  );

  // Coverage is live, so its request and cache key carry the region only.
  const coverageParams: ReportCoverageParams = useMemo(
    () => (regionId ? {regionId} : {}),
    [regionId]
  );

  const setRange = useCallback(
    ({range: next}: {range: DateRange}) =>
      setState({
        [FILTER_PARAMS.fromDate]: next.from || '',
        [FILTER_PARAMS.toDate]: next.to || '',
      }),
    [setState]
  );

  return {
    range,
    filters,
    apiParams,
    coverageParams,
    toolbarFilters,
    setRange,
  };
};
