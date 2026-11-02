'use client';

import {useMemo} from 'react';

import {ENTITY_SOURCE} from '@/shared/constants/common';
import {
  LIST_FILTER_ICONS,
  LIST_FILTER_KINDS,
} from '@/shared/constants/listToolbar';
import {
  ORG_USER_ARCHIVE_FILTER,
  ORG_USER_ARCHIVED_STATUS,
  ORG_USER_FILTER_PARAMS,
  ORG_USER_INVITATION_STATUS_VALUES,
  ORG_USER_STATUS_OPTIONS,
} from '@/shared/constants/orgUsers';
import {ListFilterFieldConfig} from '@/shared/interfaces/listToolbar';

import {useRegionFilterOptions} from './useFilterEntityOptions';
import {useListToolbarFilters} from './useListToolbarFilters';
import useTranslation from './useTranslation';

export const useOrgUserListFilters = () => {
  const {t} = useTranslation();
  const regionOptions = useRegionFilterOptions();

  const fields: ListFilterFieldConfig[] = useMemo(
    () => [
      {
        param: ORG_USER_FILTER_PARAMS.region,
        label: t('filters.region'),
        icon: LIST_FILTER_ICONS.region,
        kind: LIST_FILTER_KINDS.single,
        searchable: true,
        ...regionOptions,
      },
      {
        param: ORG_USER_FILTER_PARAMS.status,
        label: t('filters.status'),
        icon: LIST_FILTER_ICONS.status,
        kind: LIST_FILTER_KINDS.single,

        // Archived is not an employment status, but it is picked from the
        // same list; filterParams below turns it into the archive view.
        options: [
          ...ORG_USER_STATUS_OPTIONS,
          {value: ORG_USER_ARCHIVED_STATUS},
        ].map((option) => ({
          value: option.value,
          label: t(`orgUsers.statuses.${option.value}`),
        })),
      },
      {
        param: ORG_USER_FILTER_PARAMS.invitationStatus,
        label: t('filters.invitation'),
        icon: LIST_FILTER_ICONS.invitation,
        kind: LIST_FILTER_KINDS.single,
        options: ORG_USER_INVITATION_STATUS_VALUES.map((value) => ({
          value,
          label: t(`orgUsers.invitationStatuses.${value}`),
        })),
      },
      {
        param: ORG_USER_FILTER_PARAMS.source,
        label: t('filters.source'),
        icon: LIST_FILTER_ICONS.source,
        kind: LIST_FILTER_KINDS.multi,
        options: Object.values(ENTITY_SOURCE).map(({label, value}) => ({
          value,
          label,
        })),
      },
    ],
    [t, regionOptions]
  );

  const {filterParams, toolbarFilters} = useListToolbarFilters({fields});

  const {[ORG_USER_FILTER_PARAMS.status]: status, ...otherParams} =
    filterParams;

  // "Archived" asks for the archive view rather than a status, so it is sent as
  // archiveFilter and never as a status the backend would reject.
  return {
    toolbarFilters,
    filterParams:
      status === ORG_USER_ARCHIVED_STATUS
        ? {
            ...otherParams,
            [ORG_USER_FILTER_PARAMS.archiveFilter]:
              ORG_USER_ARCHIVE_FILTER.archived,
          }
        : filterParams,
  };
};
