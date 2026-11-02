import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {SEARCH} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';
import {
  GlobalSearchParams,
  GlobalSearchResponse,
} from '@/shared/interfaces/search';

export const useQueries = () => {
  return {
    useFetchGlobalSearch: ({
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {params: GlobalSearchParams}) =>
      useQueryHandler<GlobalSearchResponse>({
        queryKey: SEARCH.fetchGlobalSearch.queryKey,
        endpoint: SEARCH.fetchGlobalSearch.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
