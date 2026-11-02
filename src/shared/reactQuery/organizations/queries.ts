import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {ORGANIZATIONS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchWorkingHours: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: ORGANIZATIONS.fetchWorkingHours.queryKey,
        endpoint: ORGANIZATIONS.fetchWorkingHours.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfig,
        },
      }),

    useFetchTimeZone: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: ORGANIZATIONS.fetchTimeZone.queryKey,
        endpoint: ORGANIZATIONS.fetchTimeZone.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfig,
        },
      }),

    useFetchEscalationPolicies: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: ORGANIZATIONS.fetchEscalationPolicies.queryKey,
        endpoint: ORGANIZATIONS.fetchEscalationPolicies.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfig,
        },
      }),
  };
};
