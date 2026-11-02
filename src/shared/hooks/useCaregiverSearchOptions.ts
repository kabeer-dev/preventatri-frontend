'use client';

import {useMemo} from 'react';

import {DROPDOWN_SORT, ENTITY_STATUS} from '@/shared/constants/general';
import {CAREGIVERS} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {CaregiverSearchSource} from '@/shared/interfaces/caregiver';
import {SelectOption} from '@/shared/interfaces/inputs';
import {getFullName} from '@/shared/utils/general';

const toCaregiverOption = ({row}: {row: CaregiverSearchSource}) => ({
  value: row.profileId,
  label: getFullName({
    firstName: row.user?.firstName,
    lastName: row.user?.lastName,
  }),
});

const CAREGIVER_PARAMS = {
  status: ENTITY_STATUS.ACTIVE.value,
  ...DROPDOWN_SORT.byUserFirstName,
};

// Each caller owns its own search term, so two dropdowns open at once do not
// overwrite each other's results.
const useCaregiverSearchOptions = ({
  enabled,
  selectedOption,
}: {
  enabled: boolean;
  selectedOption?: SelectOption | null;
}): AsyncSelectSource => {
  const selectedValue = selectedOption?.value;
  const selectedLabel = selectedOption?.label;

  const seedOptions = useMemo(
    () =>
      selectedValue ? [{value: selectedValue, label: selectedLabel || ''}] : [],
    [selectedValue, selectedLabel]
  );

  return useAsyncSelectOptions({
    query: CAREGIVERS.fetchCaregiversList,
    listKey: 'caregivers',
    toOption: toCaregiverOption,
    params: CAREGIVER_PARAMS,
    enabled,
    seedOptions,
  });
};

export default useCaregiverSearchOptions;
