import {SelectOption} from '@/shared/interfaces/inputs';

export interface InfiniteListQueryParams {
  queryKey: string;
  buildEndpoint: ({params}: {params: any}) => string;

  /** Key in the response body that holds the rows, such as `regions`. */
  listKey: string;
  params?: Record<string, any>;
  enabled?: boolean;
  pageSize?: number;
}

export interface InfiniteListResult<TRow> {
  rows: TRow[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

export interface AsyncSelectSource<
  TOption extends SelectOption = SelectOption,
> {
  options: TOption[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onSearchChange: ({term}: {term: string}) => void;
  onLoadMore: () => void;
  findOption: ({value}: {value: string}) => TOption | undefined;

  // Method syntax keeps a source of a richer option usable as a plain one.
  rememberOptions({options}: {options: TOption[]}): void;
}

export interface UseAsyncSelectOptionsParams<
  TRow,
  TOption extends SelectOption = SelectOption,
> {
  toOption: ({row}: {row: TRow}) => TOption;

  /** A list query from `reactQueryConstants`, such as `REGIONS.fetchRegionsList`. */
  query: {queryKey: string; endpoint: ({params}: {params: any}) => string};

  /** Key in the response body that holds the rows, such as `regions`. */
  listKey: string;
  params?: Record<string, any>;
  enabled?: boolean;

  /** Labels for saved values that may not be on a loaded page. */
  seedOptions?: TOption[];
}
