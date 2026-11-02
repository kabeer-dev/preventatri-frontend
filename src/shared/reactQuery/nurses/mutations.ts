import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {NURSES, USERS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {NURSES: NURSES_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useUpdateNurseMutation: () =>
      useMutationHandler({
        endpoint: (params) => NURSES_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            NURSES.fetchNursesList.queryKey,
            NURSES.fetchNurse.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
        },
      }),

    useDeleteNurseMutation: () =>
      useMutationHandler({
        endpoint: (params) => NURSES_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [
            NURSES.fetchNursesList.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
        },
      }),
  };
};
