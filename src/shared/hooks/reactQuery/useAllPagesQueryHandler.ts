import {useQuery} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

import {
  ALL_PAGES_QUERY,
  DEFAULT_QUERY_OPTIONS,
} from '@/shared/constants/reactQuery/general';
import {AllPagesQueryParams} from '@/shared/interfaces/hooks';
import {UseQueryHandlerResultType} from '@/shared/types/reactQuery';
import {toQueryResult, unwrapApiResponse} from '@/shared/utils/reactQuery';
import {getRequest} from '@/shared/utils/requests';

/**
 * A list query that reads the whole list instead of its first page.
 *
 * It asks for page one, reads `meta.totalPages`, and keeps asking until the
 * server runs out of pages or the cap is reached. The rows of every page are
 * merged back under the same key the single-page call returns, so a caller
 * reads the result exactly as it reads `useQueryHandler`.
 *
 * Use it only where a count has to be exact or a filter has to see every row.
 * Anything the user pages through belongs on `useServerSideListFilters`. Past
 * `maxPages` the rows stop and `isTruncated` is true on the result.
 */
export const useAllPagesQueryHandler = <TData = any>({
  queryKey,
  buildEndpoint,
  listKey,
  params,
  enabled,
  pageSize = ALL_PAGES_QUERY.PAGE_SIZE,
  maxPages = ALL_PAGES_QUERY.MAX_PAGES,
}: AllPagesQueryParams): UseQueryHandlerResultType<TData> => {
  // The whole list is several requests, so it is read once and refetched on
  // demand rather than on a timer.
  const queryOptions: any = {...DEFAULT_QUERY_OPTIONS, refetchInterval: false};

  const query = useQuery<TData, unknown>({
    queryKey: [
      queryKey,
      ALL_PAGES_QUERY.KEY_SUFFIX,
      {...params, pageSize, maxPages},
    ],
    queryFn: async (): Promise<TData> => {
      const fetchPage = async ({page}: {page: number}) => {
        const response: AxiosResponse<any> = await getRequest({
          endpoint: buildEndpoint({params: {...params, page, limit: pageSize}}),
        });

        return unwrapApiResponse({response});
      };

      const firstPage = await fetchPage({page: 1});

      const rows: any[] = [...(firstPage.data?.[listKey] || [])];

      const totalPages = Number(firstPage.data?.meta?.totalPages) || 1;
      const lastPage = Math.min(totalPages, maxPages);

      for (let page = 2; page <= lastPage; page += 1) {
        const nextPage = await fetchPage({page});

        rows.push(...(nextPage.data?.[listKey] || []));
      }

      // A list past the cap is cut short. The flag says so, so a caller that
      // needs every row can refuse to trust the count rather than misreport it.
      return {
        ...firstPage,
        data: {
          ...firstPage.data,
          [listKey]: rows,
          isTruncated: totalPages > maxPages,
        },
      } as TData;
    },
    ...queryOptions,
    enabled,
  });

  return toQueryResult({query});
};
