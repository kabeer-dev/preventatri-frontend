'use client';

import {useState} from 'react';

import useGlobalSearch from '@/shared/hooks/useGlobalSearch';
import useTranslation from '@/shared/hooks/useTranslation';

import SearchField from './SearchField';

const TopBarSearch = () => {
  const {t} = useTranslation();
  const [term, setTerm] = useState('');

  const {results, isFetching, debouncedTerm} = useGlobalSearch({term});

  return (
    <SearchField
      term={term}
      onTermChange={({term: nextTerm}) => setTerm(nextTerm)}
      results={results}
      isFetching={isFetching}
      debouncedTerm={debouncedTerm}
      placeholder={t('shell.searchPlaceholder')}
      ariaLabel={t('shell.searchLabel')}
    />
  );
};

export default TopBarSearch;
