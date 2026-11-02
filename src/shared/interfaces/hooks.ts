import {GridPaginationModel} from '@mui/x-data-grid';

import {RootState} from '@/shared/redux/store';
import {
  RefetchConfig,
  UseQueryHandlerResultType,
} from '@/shared/types/reactQuery';

import {ErrorResponse} from './common';

export interface UseCountdownProps {
  expiresAt: string;
  onExpire?: () => void;
}

export interface UseElapsedTimeProps {
  since: string;
}

export interface UseFilterListProps<T> {
  reduxSelector: (state: RootState) => T[]; // Replace 'any' with your actual state type
  listType?: {
    searchKey: string[];
    path: string;
  };
}

export interface UseFilterListResult<T> {
  filteredList: T[];
  setSearchValue: (value: string) => void;
}

export interface UpdateUrlParamsOptions {
  shallow?: boolean;
}

export interface PageOptions {
  number: number;
  limit: number;
}

export interface ServerSideTablePaginationProps {
  page: number;
  pageSize: number;
  rowCount: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export interface UsePaginationProps {
  data: any[];
  listType: {
    page: PageOptions;
  };
  serverSideComputedTotalPage?: number;
  urlKeyPrefix?: string;
}

export interface UsePromiseResult<T> {
  isLoading: boolean;
  data: T | null;
  error: any;
  executePromise: (params: {
    fn: () => Promise<T>;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  }) => Promise<void>;
}

export interface UsePromiseCallbackProps<T> {
  fn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export interface RequestParams {
  endpoint: string | ((params?: any) => string);
  method: string;
  isThirdParty?: boolean;
  callBackFuncs?: {
    onSuccessAlways?: (data: any) => void;
    onErrorAlways?: (error: any) => void;
  };
  queriesToChangeAlways?: QueriesToChange;
  toastConfigAlways?: {
    success?: {
      show?: boolean;
      customMessage?: string;
      fallbackMessage?: string;
    };
    error?: {
      show?: boolean;
      customMessage?: string;
      fallbackMessage?: string;
    };
  };
}

export interface MutationVariables {
  payload?: any;
  params?: any;
  queriesToChange?: QueriesToChange;
  callBackFuncs?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  };
  toastConfig?: {
    success?: {
      show?: boolean;
      customMessage?: string;
    };
    error?: {
      show?: boolean;
      customMessage?: string;
    };
  };
}

export interface UseQueryHandlerProps {
  callBackFuncs?: QueryCallbacks;
  params?: any;
  enabled?: boolean;
  toastConfig?: {
    success?: {
      show?: boolean;
      customMessage?: string;
    };
    error?: {
      show?: boolean;
      customMessage?: string;
    };
  };
}

export interface ListType {
  search: {
    keys: string[];
  };
  page: PageOptions;
}

export interface UseSearchListProps<T> {
  data?: T[];
  listType: ListType | null;
  urlKeyPrefix?: string;
}

export interface SortOptions {
  sortBy: string | null;
  sortDir: string | null;
}

export interface UseSortListProps<T> {
  data?: T[];
  urlKeyPrefix?: string;
}

export interface VerifyUserProps {
  token: string;
}

export interface VerifyUserResponse {
  isRequestPending: boolean;
  isTokenExpired: boolean;
  isUserVerified: boolean;
  tokenError: string | null;
  unVerifiedEmail: string;
}

export interface FilterUpdates {
  search?: string;
  sort?: Partial<SortOptions>;
  page?: Partial<PageOptions>;
}

export interface UseClientSideFilteredListsProps<T> {
  list: T[];
  listType: ListType;
}

export interface MutationCallbacks<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onSuccessAlways?: (data?: T) => void;
  onErrorAlways?: (error?: any) => void;
}

export interface QueryRequestParams {
  queryKey: string;
  endpoint: string;
  isThirdParty?: boolean;
  params?: Record<string, any>;
  enabled?: boolean;
  customQueryOptions?: any;
  refetchConfig: RefetchConfig;
  callbacks?: {
    onSuccessAlways?: (data: any) => void;
    onErrorAlways?: (error: any) => void;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  };

  mergedToastConfig?: {
    toastConfigAlways?: {
      success?: {show?: boolean; customMessage?: string};
      error?: {show?: boolean; customMessage?: string};
    };
    toastConfig?: {
      success?: {show?: boolean; customMessage?: string};
      error?: {show?: boolean; customMessage?: string};
    };
  };
}

/** What `useAllPagesQueryHandler` needs to walk a list endpoint's pages. */
export interface AllPagesQueryParams {
  queryKey: string;

  /** The list endpoint builder from `reactQueryConstants`. */
  buildEndpoint: ({params}: {params: any}) => string;

  /** Key in the response body that holds the rows, such as `submissions`. */
  listKey: string;
  params?: Record<string, any>;
  enabled?: boolean;

  /** Rows per request. Defaults to the page size the list endpoints accept. */
  pageSize?: number;

  /** Pages to read before stopping, however many the server reports. */
  maxPages?: number;
}

export interface QueryCallbacks<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onSuccessAlways?: (data?: T) => void;
  onErrorAlways?: (error?: any) => void;
}

export interface DefaultQueryOptions<TData> {
  staleTime: number;
  gcTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnReconnect: boolean;
  refetchOnMount: boolean | 'always';
  retry: (failureCount: number, error: ErrorResponse) => boolean;
  retryDelay: (attemptIndex: number) => number;
  refetchInterval?: number | false;
  placeholderData:
    | TData
    | ((previousData: TData | undefined) => TData | undefined)
    | undefined;
}

interface QueryToPrefetch {
  queryKey: string;
  endpoint: string | ((args: {params: any}) => string);
  activeServerSidePagination?: boolean;
}

export interface PrefetchQueriesParams {
  queriesToFetch?: QueryToPrefetch[];
}

export interface ServerSideListFiltersProps {
  listType: ListType;
  queryToCall: (args: {
    params: {
      search: string;
      sortDir: string | null;
      sortBy: string | null;
      page: number;
      limit: number;
      [key: string]: any;
    };
  }) => UseQueryHandlerResultType<any>;
  dataKey?: string;
  baseParams?: Record<string, any>;
  urlKeyPrefix?: string;
}

export interface ServerSideListFiltersResult<T> {
  filteredData: T[];
  responseData: any;
  tablePaginationProps: ServerSideTablePaginationProps;
  filters: {
    search: string;
    sortOptions: SortOptions;
    pageOptions: PageOptions;
  };
  isLoading: boolean;
  error: unknown;
  message?: any;
  statusCode?: number;
  reactQueryData: Omit<
    UseQueryHandlerResultType<any>,
    keyof ServerSideListFiltersResult<any> | 'data' // The data key will not exist because it has already been destructured by the queryToCall function inside useServerSideListFilters
  >;
  setFilters: (updates: {search?: string; sort?: any; page?: any}) => void;
  resetFilters: () => void;
}

export interface RequestFunctionParams {
  endpoint: string;
  payload?: any;
}

export interface RequestFunctionResponse {
  data: any;
  [key: string]: any;
}

export interface UseDebounceParams<T> {
  value: T;
  delay?: number;
}

export interface QueriesToChange {
  invalidate?: string[];
  refetch?: string[];
}

export interface HandleQueriesParams {
  queriesToChangeAlways?: QueriesToChange;
  queriesToChange?: QueriesToChange;
}

// Inputs to the shared unsaved-changes guard used by every form surface.
export interface UseUnsavedChangesGuardParams {
  isDirty: boolean;
  isLoading: boolean;
  onClose: () => void;
}

// What a red flag form hands the shared submit hook once its fields validate.
export interface SendRedFlagParams {
  reason: number;
  description: string;
  patientId: string;
  onSuccess: () => void;
}

export interface UseInfiniteScrollSentinelParams {
  root?: HTMLElement | null;
  enabled?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
}
