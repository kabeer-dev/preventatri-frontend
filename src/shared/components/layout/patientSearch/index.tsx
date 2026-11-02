'use client';

import {useState} from 'react';

import SearchField from '@/shared/components/layout/topBarSearch/SearchField';
import usePatientSearch from '@/shared/hooks/usePatientSearch';
import useTranslation from '@/shared/hooks/useTranslation';

// Top-bar patient search for role dashboards. GET /patients already scopes the
// results to the caller's patients (nurse regions, case manager caseload).
const PatientSearch = () => {
  const {t} = useTranslation();
  const [term, setTerm] = useState('');

  const {results, isFetching, debouncedTerm} = usePatientSearch({term});

  return (
    <SearchField
      term={term}
      onTermChange={({term: nextTerm}) => setTerm(nextTerm)}
      results={results}
      isFetching={isFetching}
      debouncedTerm={debouncedTerm}
      placeholder={t('shell.searchPatientsPlaceholder')}
      ariaLabel={t('shell.searchPatientsLabel')}
    />
  );
};

export default PatientSearch;
