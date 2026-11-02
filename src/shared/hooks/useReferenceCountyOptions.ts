'use client';

import {COUNTIES} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {SelectOption} from '@/shared/interfaces/inputs';
import {ReferenceCounty} from '@/shared/interfaces/region';
import {formatCountyLabel} from '@/shared/utils/countyUtils';

const toReferenceCountyOption = ({row}: {row: ReferenceCounty}) => ({
  value: row.fipsCode,
  label: formatCountyLabel({name: row.name, stateCode: row.stateCode}),
});

// Every US county, searched and paged on the server. A region's saved
// counties are seeded so they stay labelled before their page is loaded.
export const useReferenceCountyOptions = ({
  enabled = true,
  seedOptions,
}: {
  enabled?: boolean;
  seedOptions?: SelectOption[];
}): AsyncSelectSource =>
  useAsyncSelectOptions({
    query: COUNTIES.fetchReferenceCountiesList,
    listKey: 'counties',
    toOption: toReferenceCountyOption,
    enabled,
    seedOptions,
  });
