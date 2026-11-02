'use client';

import {useMemo} from 'react';

import {DROPDOWN_SORT, ENTITY_STATUS} from '@/shared/constants/general';
import {NURSES} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {SelectOption} from '@/shared/interfaces/inputs';
import {EligibleNurse} from '@/shared/interfaces/nurse';
import {getFullName} from '@/shared/utils/general';

const toNurseOption = ({row}: {row: EligibleNurse}) => ({
  value: row.profileId,
  label: getFullName({
    firstName: row.user?.firstName,
    lastName: row.user?.lastName,
  }),
});

// Only active, verified nurses can be put on a region or a patient.
export const useNurseSelectOptions = ({
  params,
  enabled = true,
  seedOptions,
}: {
  params?: Record<string, any>;
  enabled?: boolean;
  seedOptions?: SelectOption[];
}): AsyncSelectSource => {
  const eligibleParams = useMemo(
    () => ({
      status: ENTITY_STATUS.ACTIVE.value,
      isVerified: true,
      ...DROPDOWN_SORT.byUserFirstName,
      ...params,
    }),
    [params]
  );

  return useAsyncSelectOptions({
    query: NURSES.fetchNursesList,
    listKey: 'nurses',
    toOption: toNurseOption,
    params: eligibleParams,
    enabled,
    seedOptions,
  });
};
