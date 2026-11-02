import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {
  FOLLOW_UP_TASKS,
  SUPERVISORY_VISITS,
} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {SUPERVISORY_VISITS: SUPERVISORY_VISITS_ENDPOINTS} = API_ENDPOINTS;

const {POST, PATCH} = HTTP_METHODS;

const VISIT_QUERIES_TO_REFETCH = [
  SUPERVISORY_VISITS.fetchSupervisoryVisitsList.queryKey,
  SUPERVISORY_VISITS.fetchSupervisoryVisit.queryKey,
];

const TOASTS = {error: {show: true}, success: {show: true}};

export const useMutations = () => {
  return {
    useCreateSupervisoryVisitMutation: () =>
      useMutationHandler({
        endpoint: SUPERVISORY_VISITS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {
          refetch: [SUPERVISORY_VISITS.fetchSupervisoryVisitsList.queryKey],
        },
      }),

    useUpdateSupervisoryVisitMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SUPERVISORY_VISITS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: VISIT_QUERIES_TO_REFETCH},
      }),

    useCancelSupervisoryVisitMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SUPERVISORY_VISITS_ENDPOINTS.CANCEL({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: VISIT_QUERIES_TO_REFETCH},
      }),

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // useReopenSupervisoryVisitMutation: () =>
    //   useMutationHandler({
    //     endpoint: (params) =>
    //       SUPERVISORY_VISITS_ENDPOINTS.REOPEN({id: params.id}),
    //     method: PATCH,
    //     toastConfigAlways: TOASTS,
    //     queriesToChangeAlways: {refetch: VISIT_QUERIES_TO_REFETCH},
    //   }),

    // Filing may also create follow-up tasks, so their list refreshes too.
    useCompleteSupervisoryVisitMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SUPERVISORY_VISITS_ENDPOINTS.COMPLETE({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {
          refetch: VISIT_QUERIES_TO_REFETCH.concat(
            FOLLOW_UP_TASKS.fetchFollowUpTasksList.queryKey
          ),
        },
      }),

    useApproveSupervisoryVisitMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SUPERVISORY_VISITS_ENDPOINTS.APPROVE({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: VISIT_QUERIES_TO_REFETCH},
      }),

    useRequestSupervisoryVisitCorrectionMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SUPERVISORY_VISITS_ENDPOINTS.REQUEST_CORRECTION({id: params.id}),
        method: PATCH,
        toastConfigAlways: TOASTS,
        queriesToChangeAlways: {refetch: VISIT_QUERIES_TO_REFETCH},
      }),
  };
};
