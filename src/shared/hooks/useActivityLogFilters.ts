'use client';

import {useCallback, useMemo} from 'react';

import {parseAsString, useQueryStates} from 'nuqs';

import {
  ACTIVITY_LOG_ACTION_TYPES,
  ACTIVITY_LOG_RESOURCE_TYPES,
} from '@/shared/constants/activityLog';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';

import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';

export const useActivityLogFilters = () => {
  const {t} = useTranslation();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: FILTER_PARAMS.actionType,
        label: t('filters.actionType'),
        icon: LIST_FILTER_ICONS.actionType,
        kind: LIST_FILTER_KINDS.single,
        options: ACTIVITY_LOG_ACTION_TYPES.map((action) => ({
          value: action,
          label: t(`activityLog.actions.${action.toLowerCase()}`),
        })),
      },
      {
        param: FILTER_PARAMS.resourceType,
        label: t('filters.resourceType'),
        icon: LIST_FILTER_ICONS.resourceType,
        kind: LIST_FILTER_KINDS.single,
        options: ACTIVITY_LOG_RESOURCE_TYPES.map((resourceType) => ({
          value: resourceType,
          label: t(`activityLog.resources.${resourceType}`),
        })),
      },
    ],
    [t]
  );

  const {filterParams, toolbarFilters} = useListToolbarFilters({fields});

  // The date range doesn't fit the listToolbar filter-chip shape (no 'date'
  // kind exists there), so it's persisted to the URL separately and merged
  // into the same params object the page passes as baseParams.
  const [dateRange, setDateRange] = useQueryStates(
    {
      [FILTER_PARAMS.fromDate]: parseAsString.withDefault(''),
      [FILTER_PARAMS.toDate]: parseAsString.withDefault(''),
    },
    {clearOnDefault: true}
  );

  const setDateRangeFilter = useCallback(
    ({fromDate, toDate}: {fromDate: string; toDate: string}) =>
      setDateRange({
        [FILTER_PARAMS.fromDate]: fromDate,
        [FILTER_PARAMS.toDate]: toDate,
      }),
    [setDateRange]
  );

  const dateRangeParams = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(dateRange).filter(([, value]) => value)
      ),
    [dateRange]
  );

  return {
    filterParams: {...filterParams, ...dateRangeParams},
    toolbarFilters,
    dateRange: {
      fromDate: dateRange[FILTER_PARAMS.fromDate],
      toDate: dateRange[FILTER_PARAMS.toDate],
    },
    setDateRangeFilter,
  };
};
