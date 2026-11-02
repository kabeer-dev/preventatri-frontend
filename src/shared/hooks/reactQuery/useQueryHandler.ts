import {useQuery} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';

import {
  DEFAULT_QUERY_OPTIONS,
  REFETCH_MODES,
} from '@/shared/constants/reactQuery/general';
import {QueryRequestParams} from '@/shared/interfaces/hooks';
import {
  RefetchInterval,
  UseQueryHandlerResultType,
} from '@/shared/types/reactQuery';
import {
  processToastConfig,
  toQueryResult,
  unwrapApiResponse,
} from '@/shared/utils/reactQuery';
import {getRequest} from '@/shared/utils/requests';
import {showToast} from '@/shared/utils/toasts';

/**
 * Custom React Query handler that wraps `useQuery` with standardized options,
 * refetch behavior, and callback handling.
 *
 * Refetch Config:
 * - mode: Determines the query's refetch behavior.
 *   • "static" → The query runs once and never refetches automatically.
 *   • "live"   → The query refetches periodically (default every 30 seconds, or user-defined).
 *
 * - refreshInSeconds: Optional. Number of seconds between refetches for "live" mode.
 *   Defaults to 30 seconds if not provided.
 */
export const useQueryHandler = <TData = any>({
  queryKey,
  endpoint,
  isThirdParty = false,
  params,
  enabled,
  customQueryOptions = {},
  callbacks = {},
  refetchConfig,
  mergedToastConfig,
}: QueryRequestParams): UseQueryHandlerResultType<TData> => {
  const {onSuccessAlways, onErrorAlways, onSuccess, onError} = callbacks;
  const {toastConfigAlways, toastConfig} = mergedToastConfig || {};

  const {showSuccessToast, successMessage, showErrorToast, errorMessage} =
    processToastConfig({toastConfigAlways, toastConfig});

  const isLiveMode = refetchConfig?.mode === REFETCH_MODES.LIVE;

  let refetchInterval: RefetchInterval = false;

  if (isLiveMode) {
    const refreshInSeconds = refetchConfig.refreshInSeconds ?? 30;
    refetchInterval = refreshInSeconds * 1000;
  }

  const finalQueryOptions = {
    ...DEFAULT_QUERY_OPTIONS,
    ...customQueryOptions,
    refetchInterval,
  };

  const query = useQuery<TData, unknown>({
    queryKey: params ? [queryKey, params] : [queryKey],
    queryFn: async ({meta}): Promise<TData> => {
      try {
        const response: AxiosResponse<any> = await getRequest({
          endpoint,
          isSubRoute: meta?.isSubRoute as boolean | undefined,
        });

        // Return the entire body as-is for third-party configs (Stripe, etc.)
        const res = isThirdParty
          ? response.data
          : unwrapApiResponse({response});

        onSuccessAlways?.(res);
        onSuccess?.(res);

        // Show success toast if configured
        if (showSuccessToast) {
          showToast({
            type: 'success',
            message: successMessage || res.message,
          });
        }

        return res as TData;
      } catch (err: any) {
        if (err?._sessionTimedOut) throw err;

        onErrorAlways?.(err);
        onError?.(err);

        // Show error toast if configured
        if (showErrorToast) {
          showToast({
            type: 'error',
            message: errorMessage || err.message,
          });
        }

        throw err;
      }
    },
    ...finalQueryOptions,
    enabled,
  });

  return toQueryResult({query});
};
