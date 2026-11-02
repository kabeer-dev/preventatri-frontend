'use client';

import {useMemo} from 'react';

import {
  HHA_SYNC_CHANGE_ACTION,
  HHA_SYNC_EXCEPTION_TYPES,
  HHA_SYNC_FILTER_PARAMS,
  HHA_SYNC_RESOURCES,
} from '@/shared/constants/hhaSyncHistory';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';
import {getExceptionCopy} from '@/shared/utils/hhaSyncHistoryUtils';

import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';

// Record type is carried by the Changes tabs, so the change kind is the filter.
export const useHhaSyncChangeFilters = () => {
  const {t} = useTranslation();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: HHA_SYNC_FILTER_PARAMS.action,
        label: t('hhaSyncHistory.changes.actionFilter'),
        icon: LIST_FILTER_ICONS.actionType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.entries(HHA_SYNC_CHANGE_ACTION).map(
          ([value, chip]) => ({value, label: t(chip.labelKey)})
        ),
      },
    ],
    [t]
  );

  return useListToolbarFilters({fields});
};

// Status is carried by the Exceptions tabs.
export const useHhaSyncExceptionFilters = () => {
  const {t} = useTranslation();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: HHA_SYNC_FILTER_PARAMS.type,
        label: t('hhaSyncHistory.exceptions.typeFilter'),
        icon: LIST_FILTER_ICONS.flagType,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        options: Object.keys(HHA_SYNC_EXCEPTION_TYPES).map((type) => ({
          value: type,
          label: getExceptionCopy({type, t}).title,
        })),
      },
      {
        param: HHA_SYNC_FILTER_PARAMS.resource,
        label: t('hhaSyncHistory.exceptions.resourceFilter'),
        icon: LIST_FILTER_ICONS.resourceType,
        kind: LIST_FILTER_KINDS.single,
        options: Object.entries(HHA_SYNC_RESOURCES).map(
          ([value, labelKey]) => ({
            value,
            label: t(labelKey),
          })
        ),
      },
    ],
    [t]
  );

  return useListToolbarFilters({fields});
};
