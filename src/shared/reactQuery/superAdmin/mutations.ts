import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {SUPER_ADMIN} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {SUPER_ADMIN: SUPER_ADMIN_ENDPOINTS} = API_ENDPOINTS;
const {POST} = HTTP_METHODS;

export const useMutations = () => {
  return {
    // One call per status change; the action in `params` picks the endpoint.
    useOrganizationActionMutation: () =>
      useMutationHandler({
        endpoint: SUPER_ADMIN_ENDPOINTS.ORGANIZATION_ACTION,
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [SUPER_ADMIN.fetchOrganizationsList.queryKey],
        },
      }),
  };
};
