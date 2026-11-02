import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {GridPaginationModel} from '@mui/x-data-grid';

import {
  ServerSideListFiltersProps,
  ServerSideListFiltersResult,
} from '@/shared/interfaces/hooks';

import usePagination from './usePagination';
import useSearchList from './useSearchList';
import useSortList from './useSortList';

const useServerSideListFilters = <T>({
  listType,
  queryToCall,
  dataKey,
  baseParams = {},
  urlKeyPrefix,
}: /**
 * dataKey: Specifies the key in the API response that contains the list of items.
 * It supports both direct and nested keys using dot notation.
 *
 * Example Usage:
 * - If API response is { docs: [...], meta: {...} }, pass dataKey = "docs"
 * - If API response is { trucks: [...], meta: {...} }, pass dataKey = "trucks"
 * - If API response is { customers: { list: [...] }, meta: {...} }, pass dataKey = "customers.list"
 *
 * This allows the hook to dynamically extract the correct array from the API response,
 * making it flexible for different API structures.
 */
ServerSideListFiltersProps): ServerSideListFiltersResult<T> => {
  const [serverSideComputedTotalPage, setServerSideComputedTotalPage] =
    useState(1);

  const {updateSearchValue, resetSearchValue, search, debouncedSearch} =
    useSearchList({listType: null, urlKeyPrefix});

  const {updateSortOptions, resetSortOptions, sortOptions} = useSortList({
    urlKeyPrefix,
  });

  const {updatePageOptions, resetPaginationOptions, pageOptions} =
    usePagination({listType, serverSideComputedTotalPage, urlKeyPrefix});

  // Reset to page 1 whenever the applied filters (baseParams) change, so the
  // user isn't stranded on an out-of-range page after narrowing results. Skip
  // the initial render so a page number restored from the URL is preserved
  // (PREVENT-394).
  const baseParamsKey = JSON.stringify(baseParams);
  const prevBaseParamsKey = useRef(baseParamsKey);

  useEffect(() => {
    if (prevBaseParamsKey.current === baseParamsKey) return;
    prevBaseParamsKey.current = baseParamsKey;
    resetPaginationOptions();
  }, [baseParamsKey, resetPaginationOptions]);

  // An unset URL sort must not blank out the caller's default sort.
  const activeSortOptions = sortOptions.sortBy
    ? sortOptions
    : {
        sortBy: baseParams.sortBy ?? sortOptions.sortBy,
        sortDir: baseParams.sortDir ?? sortOptions.sortDir,
      };

  const {data, isLoading, error, message, statusCode, ...reactQueryData} =
    queryToCall({
      params: {
        ...baseParams,
        search: debouncedSearch,
        ...activeSortOptions,
        page: pageOptions.number,
        limit: pageOptions.limit,
      },
    });

  const getNestedValue = ({obj, path}: {obj: any; path: string}): T[] => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) || [];
  };

  const list: T[] = dataKey ? getNestedValue({obj: data, path: dataKey}) : [];
  const hasMeta = !!data?.meta;
  const meta = data?.meta || {};
  const {totalPages = 1, count = list.length} = meta;

  // Keep last known rowCount so MUI DataGrid doesn't auto-reset page to 0
  // when `data` is briefly undefined during a refetch (which would force
  // users to click Next twice).
  const [lastKnownRowCount, setLastKnownRowCount] = useState(count);

  if (hasMeta && count !== lastKnownRowCount) setLastKnownRowCount(count);

  const stableRowCount = hasMeta ? count : lastKnownRowCount;

  if (hasMeta && totalPages !== serverSideComputedTotalPage) {
    setServerSideComputedTotalPage(totalPages);
  }

  useEffect(() => {
    if (
      hasMeta &&
      !isLoading &&
      totalPages > 0 &&
      pageOptions.number > totalPages &&
      list.length === 0
    ) {
      updatePageOptions({page: {number: totalPages}});
    }
  }, [
    hasMeta,
    isLoading,
    totalPages,
    pageOptions.number,
    list.length,
    updatePageOptions,
  ]);

  const setFilters = useCallback(
    (updates: {search?: string; sort?: any; page?: any}) => {
      if ('search' in updates) {
        updateSearchValue({value: updates.search as string});
        resetPaginationOptions();
      }
      if ('sort' in updates) updateSortOptions({options: updates.sort});
      if ('page' in updates) updatePageOptions({page: updates.page});
    },
    [
      updateSearchValue,
      updateSortOptions,
      updatePageOptions,
      resetPaginationOptions,
    ]
  );

  const resetFilters = useCallback(() => {
    resetSearchValue();
    resetSortOptions();
    resetPaginationOptions();
  }, [resetSearchValue, resetSortOptions, resetPaginationOptions]);

  const tablePaginationProps = useMemo(
    () => ({
      page: Math.max(pageOptions.number - 1, 0),
      pageSize: pageOptions.limit,
      rowCount: stableRowCount,
      onPaginationModelChange: ({page, pageSize}: GridPaginationModel) => {
        if (page === pageOptions.number - 1 && pageSize === pageOptions.limit) {
          return;
        }

        updatePageOptions({
          page: {
            number: page + 1,
            limit: pageSize,
          },
        });
      },
    }),
    [pageOptions.number, pageOptions.limit, stableRowCount, updatePageOptions]
  );

  return {
    filteredData: list,

    // Raw response body, for lists whose endpoint returns more than the rows
    // and meta (the Users roster also returns per-role tab counts).
    responseData: data,
    tablePaginationProps,
    filters: {
      search,
      sortOptions,
      pageOptions,
    },
    isLoading,
    error,
    message,
    statusCode,
    reactQueryData,
    setFilters,
    resetFilters,
  };
};

export default useServerSideListFilters;
