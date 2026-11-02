import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {CHECKLIST_ASSIGNMENTS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {CHECKLIST_ASSIGNMENTS: ASSIGNMENTS_ENDPOINTS} = API_ENDPOINTS;
const {POST, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useCreateChecklistAssignmentsMutation: () =>
      useMutationHandler({
        endpoint: ASSIGNMENTS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            CHECKLIST_ASSIGNMENTS.fetchChecklistAssignmentsList.queryKey,
          ],
        },
      }),

    useDeleteChecklistAssignmentMutation: () =>
      useMutationHandler({
        endpoint: (params) => ASSIGNMENTS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            CHECKLIST_ASSIGNMENTS.fetchChecklistAssignmentsList.queryKey,
          ],
        },
      }),
  };
};
