'use client';

import {useMemo} from 'react';

import {DROPDOWN_SORT, ENTITY_STATUS} from '@/shared/constants/general';
import {
  CASE_MANAGERS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {
  CaseManagerOptionRow,
  UseCaseManagerSelectOptionsParams,
} from '@/shared/interfaces/caseManager';
import {getFullName} from '@/shared/utils/general';

const toCaseManagerOption = ({row}: {row: CaseManagerOptionRow}) => ({
  value: row.profileId,
  label: getFullName({
    firstName: row.user?.firstName,
    lastName: row.user?.lastName,
  }),
});

// Only active case managers who accepted an invitation can be put on a patient.
export const useCaseManagerSelectOptions = ({
  enabled = true,
  seedOptions,
}: UseCaseManagerSelectOptionsParams): AsyncSelectSource => {
  const params = useMemo(
    () =>
      Object.assign(
        {status: ENTITY_STATUS.ACTIVE.value, isVerified: true},
        DROPDOWN_SORT.byUserFirstName,
        SUB_ROUTE_PARAMS
      ),
    []
  );

  return useAsyncSelectOptions({
    query: CASE_MANAGERS.fetchCaseManagersList,
    listKey: 'caseManagers',
    toOption: toCaseManagerOption,
    params,
    enabled,
    seedOptions,
  });
};
