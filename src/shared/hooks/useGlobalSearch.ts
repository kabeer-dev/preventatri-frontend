import {useMemo} from 'react';

import {GLOBAL_SEARCH_RESULTS_LIMIT} from '@/shared/constants/globalSearch';
import useDebouncedSearchTerm from '@/shared/hooks/useDebouncedSearchTerm';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  SearchResult,
  UseGlobalSearchParams,
  UseGlobalSearchResult,
} from '@/shared/interfaces/search';
import {searchQueries} from '@/shared/reactQuery';
import {mapSearchRowToResult} from '@/shared/utils/globalSearch';

const useGlobalSearch = ({
  term,
}: UseGlobalSearchParams): UseGlobalSearchResult => {
  const {t} = useTranslation();

  const {debouncedTerm, enabled} = useDebouncedSearchTerm({term});

  const {useFetchGlobalSearch} = searchQueries();

  const {data, isFetching} = useFetchGlobalSearch({
    params: {search: debouncedTerm, limit: GLOBAL_SEARCH_RESULTS_LIMIT},
    enabled,
  });

  const rows = data?.results;

  const results = useMemo(() => {
    if (!enabled) return [];

    return (rows ?? [])
      .map((row) => mapSearchRowToResult({row, t}))
      .filter((result): result is SearchResult => result !== null);
  }, [enabled, rows, t]);

  return {
    results,
    isFetching: enabled && isFetching,
    debouncedTerm,
  };
};

export default useGlobalSearch;
