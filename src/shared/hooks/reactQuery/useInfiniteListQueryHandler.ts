import {useCallback, useMemo} from 'react';

import {useInfiniteQuery} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

import {DROPDOWN_SEARCH_PAGE_SIZE} from '@/shared/constants/general';
import {
  DEFAULT_QUERY_OPTIONS,
  INFINITE_LIST_QUERY,
} from '@/shared/constants/reactQuery/general';
import {
  InfiniteListQueryParams,
  InfiniteListResult,
} from '@/shared/interfaces/asyncSelect';
import {unwrapApiResponse} from '@/shared/utils/reactQuery';
import {getRequest} from '@/shared/utils/requests';
import {showToast} from '@/shared/utils/toasts';

// A list read one page at a time on demand, for dropdowns that scroll.
export const useInfiniteListQueryHandler = <TRow = any>({
  queryKey,
  buildEndpoint,
  listKey,
  params,
  enabled,
  pageSize = DROPDOWN_SEARCH_PAGE_SIZE,
}: InfiniteListQueryParams): InfiniteListResult<TRow> => {
  // No placeholder: a previous term's or scope's rows must not stay pickable
  // while the new first page loads.
  const queryOptions: any = {
    ...DEFAULT_QUERY_OPTIONS,
    refetchInterval: false,
    placeholderData: undefined,
  };

  const query = useInfiniteQuery<any>({
    queryKey: [queryKey, INFINITE_LIST_QUERY.KEY_SUFFIX, {...params, pageSize}],
    initialPageParam: INFINITE_LIST_QUERY.FIRST_PAGE,
    queryFn: async ({pageParam}) => {
      try {
        const response: AxiosResponse<any> = await getRequest({
          endpoint: buildEndpoint({
            params: {...params, page: pageParam, limit: pageSize},
          }),
        });

        return unwrapApiResponse({response});
      } catch (err: any) {
        // Same as useQueryHandler: the session-timeout modal owns that error.
        if (!err?._sessionTimedOut)
          showToast({type: 'error', message: err?.message});

        throw err;
      }
    },
    getNextPageParam: (lastPage: any) => {
      const meta = lastPage?.data?.meta;

      if (!meta) return undefined;

      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    ...queryOptions,
    enabled,
  });

  const rows: TRow[] = useMemo(
    () =>
      (query.data?.pages ?? []).flatMap(
        (page: any) => page?.data?.[listKey] ?? []
      ),
    [query.data, listKey]
  );

  const {isFetchingNextPage, fetchNextPage} = query;

  // A failed page stops the paging, or auto-fill would retry it in a loop.
  const hasNextPage = Boolean(query.hasNextPage) && !query.isFetchNextPageError;

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    rows,
    hasNextPage,
    fetchNextPage: loadNextPage,
    isLoading: query.isLoading,
    isFetchingNextPage,
  };
};
