'use client';

import {useMemo} from 'react';

import {DROPDOWN_SORT} from '@/shared/constants/general';
import {PATIENT_MINIMAL_VIEW_PARAMS} from '@/shared/constants/patients';
import {
  PATIENTS,
  SUB_ROUTE_PARAMS,
} from '@/shared/constants/reactQueryConstants';
import {useAsyncSelectOptions} from '@/shared/hooks/useAsyncSelectOptions';
import {AsyncSelectSource} from '@/shared/interfaces/asyncSelect';
import {FilterPatientSource} from '@/shared/interfaces/listToolbar';
import {PatientPickerOptionsParams} from '@/shared/interfaces/workItem';
import {getFullName} from '@/shared/utils/general';

const toPatientOption = ({row}: {row: FilterPatientSource}) => ({
  value: row.id,
  label: getFullName(row),
});

const PATIENT_PICKER_PARAMS = {
  ...PATIENT_MINIMAL_VIEW_PARAMS,
  ...SUB_ROUTE_PARAMS,
  ...DROPDOWN_SORT.byLastName,
};

// The Patient picker of the follow-up and supervisory visit forms, searched
// and paged on the server. A locked patient is labelled from its seed.
export const usePatientPickerOptions = ({
  enabled,
  lockedPatient,
}: PatientPickerOptionsParams): AsyncSelectSource => {
  const lockedId = lockedPatient?.id;
  const lockedFirstName = lockedPatient?.firstName;
  const lockedLastName = lockedPatient?.lastName;

  const seedOptions = useMemo(
    () =>
      lockedId
        ? [
            {
              value: lockedId,
              label: getFullName({
                firstName: lockedFirstName,
                lastName: lockedLastName,
              }),
            },
          ]
        : [],
    [lockedId, lockedFirstName, lockedLastName]
  );

  return useAsyncSelectOptions({
    query: PATIENTS.fetchPatientsList,
    listKey: 'patients',
    toOption: toPatientOption,
    params: PATIENT_PICKER_PARAMS,
    enabled,
    seedOptions,
  });
};
