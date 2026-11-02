import {useMemo} from 'react';

import {
  GLOBAL_SEARCH_RESULTS_LIMIT,
  SEARCH_RESULT_TYPES,
} from '@/shared/constants/globalSearch';
import {PATIENT_SUMMARY_VIEW_PARAMS} from '@/shared/constants/patients';
import useDebouncedSearchTerm from '@/shared/hooks/useDebouncedSearchTerm';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  PatientSearchResponse,
  UseGlobalSearchParams,
  UseGlobalSearchResult,
} from '@/shared/interfaces/search';
import {patientQueries} from '@/shared/reactQuery';
import {mapSearchRowToResult} from '@/shared/utils/globalSearch';

const usePatientSearch = ({
  term,
}: UseGlobalSearchParams): UseGlobalSearchResult => {
  const {t} = useTranslation();

  const {debouncedTerm, enabled} = useDebouncedSearchTerm({term});

  const {useFetchPatientsList} = patientQueries();

  const {data, isFetching} = useFetchPatientsList({
    params: {
      search: debouncedTerm,
      limit: GLOBAL_SEARCH_RESULTS_LIMIT,
      ...PATIENT_SUMMARY_VIEW_PARAMS,
    },
    enabled,
  });

  const response: PatientSearchResponse | undefined = data;
  const patients = response?.patients;

  // Shaped like a global search row so the shared result item renders it.
  const results = useMemo(() => {
    if (!enabled) return [];

    return (patients ?? []).flatMap((patient) => {
      const result = mapSearchRowToResult({
        row: {
          id: patient.id,
          type: SEARCH_RESULT_TYPES.patient,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: null,
          location: patient.county?.name ?? null,
        },
        t,
      });

      return result ? [result] : [];
    });
  }, [enabled, patients, t]);

  return {
    results,
    isFetching: enabled && isFetching,
    debouncedTerm,
  };
};

export default usePatientSearch;
