import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {NURSES} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';
import {NurseDashboardResponse} from '@/shared/interfaces/nurse';

export const useQueries = () => {
  return {
    useFetchNursesList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: NURSES.fetchNursesList.queryKey,
        endpoint: NURSES.fetchNursesList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchNurse: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: NURSES.fetchNurse.queryKey,
        endpoint: NURSES.fetchNurse.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchNurseAdminStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: NURSES.fetchNurseAdminStats.queryKey,
        endpoint: NURSES.fetchNurseAdminStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchNurseDashboard: ({
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<NurseDashboardResponse>({
        queryKey: NURSES.fetchNurseDashboard.queryKey,
        endpoint: NURSES.fetchNurseDashboard.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
