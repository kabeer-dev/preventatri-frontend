import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {TRIAGE_ENGINE} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';
import {
  TriageAlertsParams,
  TriageAlertsResponse,
  TriageEngineStatsResponse,
} from '@/shared/interfaces/triageEngine';

export const useQueries = () => {
  return {
    useFetchTriageEngineStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<TriageEngineStatsResponse>({
        queryKey: TRIAGE_ENGINE.fetchStats.queryKey,
        endpoint: TRIAGE_ENGINE.fetchStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchTriageEngineAlerts: ({
      params,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {params: TriageAlertsParams}) =>
      useQueryHandler<TriageAlertsResponse>({
        queryKey: TRIAGE_ENGINE.fetchAlerts.queryKey,
        endpoint: TRIAGE_ENGINE.fetchAlerts.endpoint({params}),
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
