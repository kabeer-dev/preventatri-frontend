import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {FOLLOW_UP_TASKS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {FOLLOW_UP_TASKS: FOLLOW_UP_TASKS_ENDPOINTS} = API_ENDPOINTS;

const {POST, PATCH} = HTTP_METHODS;

const TASK_QUERIES_TO_REFETCH = [
  FOLLOW_UP_TASKS.fetchFollowUpTasksList.queryKey,
  FOLLOW_UP_TASKS.fetchFollowUpTask.queryKey,
];

const TOASTS = {error: {show: true}, success: {show: true}};

export const useMutations = () => {
  return {
    useCreateFollowUpTaskMutation: () =>
      useMutationHandler({
        endpoint: FOLLOW_UP_TASKS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {
          refetch: [FOLLOW_UP_TASKS.fetchFollowUpTasksList.queryKey],
        },
      }),

    useUpdateFollowUpTaskMutation: () =>
      useMutationHandler({
        endpoint: (params) => FOLLOW_UP_TASKS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: TASK_QUERIES_TO_REFETCH},
      }),

    useCancelFollowUpTaskMutation: () =>
      useMutationHandler({
        endpoint: (params) => FOLLOW_UP_TASKS_ENDPOINTS.CANCEL({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: TASK_QUERIES_TO_REFETCH},
      }),

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // useReopenFollowUpTaskMutation: () =>
    //   useMutationHandler({
    //     endpoint: (params) => FOLLOW_UP_TASKS_ENDPOINTS.REOPEN({id: params.id}),
    //     method: PATCH,
    //     toastConfigAlways: TOASTS,
    //     queriesToChangeAlways: {refetch: TASK_QUERIES_TO_REFETCH},
    //   }),

    useSubmitFollowUpTaskMutation: () =>
      useMutationHandler({
        endpoint: (params) => FOLLOW_UP_TASKS_ENDPOINTS.SUBMIT({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: TASK_QUERIES_TO_REFETCH},
      }),

    useCompleteFollowUpTaskMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          FOLLOW_UP_TASKS_ENDPOINTS.COMPLETE({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: TASK_QUERIES_TO_REFETCH},
      }),
  };
};
