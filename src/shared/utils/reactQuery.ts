import {QueryClient, UseQueryResult} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

import {QUERY_TIMINGS} from '@/shared/constants/reactQuery/general';
import {UseQueryHandlerResultType} from '@/shared/types/reactQuery';

// Helper function to create a new QueryClient
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_TIMINGS.STALE_TIME_FOR_SERVER_SIDE_QUERY_CLIENT,
      },
    },
  });

let browserQueryClient = undefined;

export function getQueryClient() {
  return typeof window === 'undefined'
    ? createQueryClient() // Always create a new instance for the server
    : (browserQueryClient ??= createQueryClient()); // Reuse the instance on the client
}

export const createRefetchOptions = ({
  intervalMs,
  enableRefetch = true,
}: {
  intervalMs: number;
  enableRefetch?: boolean;
}) => ({
  staleTime: enableRefetch ? intervalMs : Infinity,
  refetchInterval: enableRefetch ? intervalMs : false,
  refetchOnWindowFocus: enableRefetch,
  refetchOnMount: enableRefetch,
  refetchOnReconnect: enableRefetch,
});

export const processToastConfig = ({
  toastConfigAlways,
  toastConfig,
}: {
  toastConfigAlways?: any;
  toastConfig?: any;
}) => {
  const merged = {
    success: {...toastConfigAlways?.success, ...toastConfig?.success},
    error: {...toastConfigAlways?.error, ...toastConfig?.error},
  };

  const {
    success: {
      show: showSuccessToast = false,
      customMessage: successMessage = '',
      fallbackMessage: successFallbackMessage = '',
    } = {},
    error: {
      show: showErrorToast = false,
      customMessage: errorMessage = '',
      fallbackMessage: errorFallbackMessage = '',
    } = {},
  } = merged;

  return {
    showSuccessToast,
    successMessage,
    successFallbackMessage,
    showErrorToast,
    errorMessage,
    errorFallbackMessage,
  };
};

// Whether a query has finished a fetch (success or failure) since `since`.
// Editors use it to keep a just-saved draft on screen until the refetch that
// the save triggered has landed, so the old value never flashes back.
export const hasQuerySettledSince = ({
  since,
  dataUpdatedAt,
  errorUpdatedAt,
}: {
  since: number;
  dataUpdatedAt: number;
  errorUpdatedAt: number;
}) => dataUpdatedAt > since || errorUpdatedAt > since;

// The API wraps every payload as `{body, ...meta}`. Callers read `data`.
export const unwrapApiResponse = ({
  response,
}: {
  response: AxiosResponse<any>;
}) => {
  const {body, ...rest} = response.data || {};

  return {data: body, ...rest};
};

// Spreads the unwrapped payload and the error onto the query result, so a
// call site destructures response fields next to `isLoading` and `refetch`.
export const toQueryResult = <TData>({
  query,
}: {
  query: UseQueryResult<TData, unknown>;
}): UseQueryHandlerResultType<TData> => {
  const {data, error, ...rest} = query;

  return {
    ...data,
    ...(error ?? {}),
    ...rest,
    error,
  } as UseQueryHandlerResultType<TData>;
};
