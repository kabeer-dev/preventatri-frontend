import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {CAREGIVERS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {CaregiverDashboardStatsResponse} from '@/shared/interfaces/caregiver';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchCaregiversList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: CAREGIVERS.fetchCaregiversList.queryKey,
        endpoint: CAREGIVERS.fetchCaregiversList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchCaregiver: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: CAREGIVERS.fetchCaregiver.queryKey,
        endpoint: CAREGIVERS.fetchCaregiver.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchCaregiverStatistics: ({
      id,
      params,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: CAREGIVERS.fetchCaregiverStatistics.queryKey,
        endpoint: CAREGIVERS.fetchCaregiverStatistics.endpoint({id, params}),
        params: {...params, id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchCaregiverAdminStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: CAREGIVERS.fetchCaregiverAdminStats.queryKey,
        endpoint: CAREGIVERS.fetchCaregiverAdminStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    // Self-service stats for the logged-in caregiver (GET /caregivers/stats)
    useFetchCaregiverStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<CaregiverDashboardStatsResponse>({
        queryKey: CAREGIVERS.fetchCaregiverStats.queryKey,
        endpoint: CAREGIVERS.fetchCaregiverStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
