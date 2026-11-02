import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {AUDIT_LOGS: AUDIT_LOGS_ENDPOINTS} = API_ENDPOINTS;
const {POST} = HTTP_METHODS;

export const useMutations = () => {
  return {
    // Fire and forget: a failed audit call must never get in the way of the
    // download the user just asked for, so no toasts.
    useLogDataExportMutation: () =>
      useMutationHandler({
        endpoint: AUDIT_LOGS_ENDPOINTS.EXPORTS(),
        method: POST,
        toastConfigAlways: {
          error: {show: false},
          success: {show: false},
        },
      }),
  };
};
