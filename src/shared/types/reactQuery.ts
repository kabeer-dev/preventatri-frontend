import {UseQueryResult} from '@tanstack/react-query';

import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {
  RequestFunctionParams,
  RequestFunctionResponse,
} from '@/shared/interfaces/hooks';

export type UseQueryHandlerResultType<TData> = UseQueryResult<
  TData,
  unknown
> & {
  data?: TData;
  error?: unknown;
  message?: any;
  statusCode?: number;
};

export type RequestFunction = (
  params: RequestFunctionParams
) => Promise<RequestFunctionResponse>;

export type RefetchMode = (typeof REFETCH_MODES)[keyof typeof REFETCH_MODES];

// Type-safe refetch configuration
export type RefetchConfig =
  | {mode: 'static'}
  | {mode: 'live'; refreshInSeconds?: number};

export type RefetchInterval = number | false;
