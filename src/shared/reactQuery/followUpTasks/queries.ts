import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {FOLLOW_UP_TASKS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchFollowUpTasksList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: FOLLOW_UP_TASKS.fetchFollowUpTasksList.queryKey,
        endpoint: FOLLOW_UP_TASKS.fetchFollowUpTasksList.endpoint({
          params,
        }),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchFollowUpTask: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: FOLLOW_UP_TASKS.fetchFollowUpTask.queryKey,
        endpoint: FOLLOW_UP_TASKS.fetchFollowUpTask.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    // The patient's care team: the only people a task can be assigned to.
    useFetchFollowUpAssignees: ({
      patientId,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {patientId: string}) =>
      useQueryHandler({
        queryKey: FOLLOW_UP_TASKS.fetchFollowUpAssignees.queryKey,
        endpoint: FOLLOW_UP_TASKS.fetchFollowUpAssignees.endpoint({
          params: {patientId},
        }),
        params: {patientId},
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
