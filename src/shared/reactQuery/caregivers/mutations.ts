import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {CAREGIVERS, USERS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {CAREGIVERS: CAREGIVERS_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useUpdateCaregiverMutation: () =>
      useMutationHandler({
        endpoint: (params) => CAREGIVERS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: false}},
        queriesToChangeAlways: {
          refetch: [
            CAREGIVERS.fetchCaregiversList.queryKey,
            CAREGIVERS.fetchCaregiver.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
        },
      }),

    useDeleteCaregiverMutation: () =>
      useMutationHandler({
        endpoint: (params) => CAREGIVERS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {error: {show: true}, success: {show: false}},
        queriesToChangeAlways: {
          refetch: [
            CAREGIVERS.fetchCaregiversList.queryKey,
            USERS.fetchOrgUsersList.queryKey,
          ],
        },
      }),
  };
};
