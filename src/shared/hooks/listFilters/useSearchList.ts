import {useMemo, useCallback} from 'react';

import {parseAsString, useQueryState} from 'nuqs';

import {FILTERS_CONFIG} from '@/shared/constants/reactQueryConstants';
import {UseSearchListProps} from '@/shared/interfaces/hooks';

import useDebounce from './useDebounce';

const useSearchList = <T>(
  {data, listType, urlKeyPrefix}: UseSearchListProps<T> = {
    data: [],
    listType: null,
  }
) => {
  const searchUrlKey = urlKeyPrefix ? `${urlKeyPrefix}_search` : 'search';

  const [search, setSearch] = useQueryState(
    searchUrlKey,
    parseAsString.withDefault(FILTERS_CONFIG.search)
  );
  const debouncedSearch = useDebounce({value: search, delay: 500});

  const extractNestedValue = ({item, key}: {item: any; key: any}) =>
    key.split('.').reduce((obj: any, prop: any) => obj?.[prop], item);

  const isMatchingSearch = useCallback(
    (item: any) =>
      listType?.search.keys.some((key) => {
        const value = extractNestedValue({item, key});

        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }),
    [listType?.search.keys, debouncedSearch]
  );

  const filteredList = useMemo(() => {
    if (!data?.length || !debouncedSearch) return data;

    return data.filter(isMatchingSearch);
  }, [data, debouncedSearch, isMatchingSearch]);

  const updateSearchValue = ({value}: {value: string}) => {
    setSearch(value);
  };

  const resetSearchValue = () => {
    setSearch(FILTERS_CONFIG.search);
  };

  return {
    filteredList,
    updateSearchValue,
    resetSearchValue,
    search,
    debouncedSearch,
  };
};

export default useSearchList;
