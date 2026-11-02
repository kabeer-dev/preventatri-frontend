import {Query, QueryClient, useQueryClient} from '@tanstack/react-query';

import {HandleQueriesParams} from '@/shared/interfaces/hooks';

/**
 * Tags every query matching `predicate` with `meta.isSubRoute=true` before
 * triggering it, so `useQueryHandler`'s `queryFn` reads it on every attempt
 * (initial fetch, retries, and fetches that were paused and later resumed),
 * then clears the flag once the operation settles. Tagging the query object
 * itself (rather than a time-boxed global flag) keeps the marker scoped to
 * these specific queries for their whole lifecycle, instead of a window that
 * closes before slower or retried requests get a chance to read it.
 */
const runMatchingQueriesAsSubRoute = ({
  queryClient,
  predicate,
  run,
}: {
  queryClient: QueryClient;
  predicate: (query: Query) => boolean;
  run: () => Promise<unknown>;
}) => {
  const matchedQueries = queryClient.getQueryCache().findAll({predicate});

  matchedQueries.forEach((query) => {
    query.setOptions({
      ...query.options,
      meta: {...query.meta, isSubRoute: true},
    });
  });

  return run().finally(() => {
    matchedQueries.forEach((query) => {
      if (!query.meta) return;

      const {isSubRoute: _isSubRoute, ...restMeta} = query.meta;

      query.setOptions({...query.options, meta: restMeta});
    });
  });
};

export const useInvalidateAndRefetchQuery = () => {
  const queryClient = useQueryClient();

  const handleQueries = ({
    queriesToChangeAlways,
    queriesToChange,
  }: HandleQueriesParams) => {
    const invalidateQueries = [
      ...(queriesToChangeAlways?.invalidate || []),
      ...(queriesToChange?.invalidate || []),
    ];

    const refetchQueries = [
      ...(queriesToChangeAlways?.refetch || []),
      ...(queriesToChange?.refetch || []),
    ];

    // Invalidate queries in background, always as a sub-route request
    if (invalidateQueries.length > 0) {
      const predicate = (query: Query) =>
        invalidateQueries.some((key) => query.queryKey.includes(key));

      runMatchingQueriesAsSubRoute({
        queryClient,
        predicate,
        run: () => queryClient.invalidateQueries({predicate}),
      });
    }

    // Refetch queries in background, always as a sub-route request
    if (refetchQueries.length > 0) {
      const predicate = (query: Query) =>
        refetchQueries.some((key) => query.queryKey.includes(key));

      runMatchingQueriesAsSubRoute({
        queryClient,
        predicate,
        run: () => queryClient.refetchQueries({predicate}),
      });
    }
  };

  return {handleQueries};
};
