import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {DASHBOARD} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {
  AdminDashboardStatsResponse,
  AdminDashboardTrendsResponse,
} from '@/shared/interfaces/dashboard';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchAdminDashboardStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<AdminDashboardStatsResponse>({
        queryKey: DASHBOARD.fetchAdminStats.queryKey,
        endpoint: DASHBOARD.fetchAdminStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchAdminDashboardStatsTrends: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<AdminDashboardTrendsResponse>({
        queryKey: DASHBOARD.fetchAdminStatsTrends.queryKey,
        endpoint: DASHBOARD.fetchAdminStatsTrends.endpoint({params}),
        params,
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
