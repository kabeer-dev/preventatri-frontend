'use client';

import {DROPDOWN_SORT} from '@/shared/constants/general';
import {REGIONS} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {SelectOption} from '@/shared/interfaces/inputs';
import {Region} from '@/shared/interfaces/region';

const toRegionOption = ({row}: {row: Region}) => ({
  value: row.id,
  label: row.name,
});

// Active regions, searched and paged on the server.
export const useRegionSelectOptions = ({
  enabled = true,
  seedOptions,
}: {
  enabled?: boolean;
  seedOptions?: SelectOption[];
}): AsyncSelectSource =>
  useAsyncSelectOptions({
    query: REGIONS.fetchActiveRegionsList,
    listKey: 'regions',
    toOption: toRegionOption,
    params: DROPDOWN_SORT.byName,
    enabled,
    seedOptions,
  });
