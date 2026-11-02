import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {HHA_VISITS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    // Read-only page of the visits the HHAeXchange sync stored
    // (GET /integration/visits). STATIC: the data only moves when a sync runs,
    // and the sync mutation refetches this key itself.
    useFetchHhaVisitsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_VISITS.fetchHhaVisitsList.queryKey,
        endpoint: HHA_VISITS.fetchHhaVisitsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaVisit: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: HHA_VISITS.fetchHhaVisit.queryKey,
        endpoint: HHA_VISITS.fetchHhaVisit.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
