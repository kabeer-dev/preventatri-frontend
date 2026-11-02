import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {CASE_MANAGERS, USERS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {CASE_MANAGERS: CASE_MANAGERS_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useUpdateCaseManagerMutation: () =>
      useMutationHandler({
        endpoint: (params) => CASE_MANAGERS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            CASE_MANAGERS.fetchCaseManagersList.queryKey,
            CASE_MANAGERS.fetchCaseManager.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
          invalidate: [CASE_MANAGERS.fetchAvailablePatients.queryKey],
        },
      }),

    useDeleteCaseManagerMutation: () =>
      useMutationHandler({
        endpoint: (params) => CASE_MANAGERS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            CASE_MANAGERS.fetchCaseManagersList.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
          invalidate: [CASE_MANAGERS.fetchAvailablePatients.queryKey],
        },
      }),
  };
};
