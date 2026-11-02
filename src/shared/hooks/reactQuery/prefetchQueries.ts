/**
 * This function prefetches queries to improve data fetching performance
 * and optimize server-side rendering.
 *
 * - It initializes a query client and retrieves cookies for authentication.
 * - If queries are provided, it prefetches data using `getServerRequest`.
 *
 * This ensures that data is available ahead of time, reducing load times
 * and improving user experience.
 */

import {QueryClient} from '@tanstack/react-query';
import {cookies} from 'next/headers';

import {FILTERS_CONFIG} from '@/shared/constants/reactQueryConstants';
import {ApiEnvelope} from '@/shared/interfaces/common';
import {PrefetchQueriesParams} from '@/shared/interfaces/hooks';
import {getQueryClient} from '@/shared/utils/reactQuery';
import {getServerRequest} from '@/shared/utils/requests';

export async function prefetchQueries({
  queriesToFetch,
}: PrefetchQueriesParams): Promise<QueryClient> {
  const queryClient = getQueryClient();
  const cookieHeader = await cookies();

  if (!queriesToFetch || queriesToFetch.length === 0) return queryClient;

  await Promise.allSettled(
    queriesToFetch.map(async (query) => {
      try {
        const useServerSidePagination =
          query.activeServerSidePagination === true;

        const queryKey = useServerSidePagination
          ? [query.queryKey, FILTERS_CONFIG] // Include FILTERS_CONFIG for specific queries
          : [query.queryKey]; // Use original key for unconfigured queries

        // Determine endpoint - use function if available with optional FILTERS_CONFIG
        const requestEndpoint =
          typeof query.endpoint === 'function'
            ? query.endpoint({params: FILTERS_CONFIG})
            : query.endpoint;

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const response = await getServerRequest<ApiEnvelope>({
              endpoint: requestEndpoint,
              cookieHeader: cookieHeader.toString(),
            });

            const {body, ...rest} = response.data;

            return {data: body, ...rest};
          },
        });
      } catch (_error) {
        queryClient.invalidateQueries({queryKey: [query.queryKey]});
      }
    })
  );

  return queryClient;
}
