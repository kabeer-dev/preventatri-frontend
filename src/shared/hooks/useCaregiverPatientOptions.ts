'use client';

import {useMemo} from 'react';

import {PATIENT_SUMMARY_VIEW_PARAMS} from '@/shared/constants/patients';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {CaregiverPatientOption} from '@/shared/interfaces/patient';
import {patientQueries} from '@/shared/reactQuery';
import {getFullName} from '@/shared/utils/general';
import {
  buildPatientIdentityLine,
  transformPatientResponse,
} from '@/shared/utils/patientUtils';

/**
 * Every patient the caregiver is assigned to, as "Last, First" rows sorted by
 * name. Every page is read, not the first: a patient on page two is still one
 * she may need to pick, filter by or raise a flag about.
 */
const useCaregiverPatientOptions = () => {
  const {useFetchAllPatients} = patientQueries();

  const {data, isLoading, isError, refetch} = useFetchAllPatients({
    params: {...PATIENT_SUMMARY_VIEW_PARAMS, ...SUB_ROUTE_PARAMS},
  });

  const patients: CaregiverPatientOption[] = useMemo(() => {
    const rows = (data?.patients || []).map((raw: any) => {
      const patient = transformPatientResponse({patient: raw});

      return {
        id: patient.id,
        firstName: patient.firstName || '',
        name: getFullName({
          firstName: patient.firstName,
          lastName: patient.lastName,
          lastFirst: true,
        }),
        identityLine: buildPatientIdentityLine({
          patient,
          parts: ['age', 'gender'],
        }),
      };
    });

    return rows
      .filter(({id, name}: CaregiverPatientOption) => id && name)
      .sort((a: CaregiverPatientOption, b: CaregiverPatientOption) =>
        a.name.localeCompare(b.name)
      );
  }, [data]);

  return {patients, isLoading, isError, refetch};
};

export default useCaregiverPatientOptions;
