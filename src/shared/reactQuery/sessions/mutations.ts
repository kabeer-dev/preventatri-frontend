import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {SESSIONS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {SESSIONS: SESSIONS_ENDPOINTS} = API_ENDPOINTS;
const {DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useRevokeSessionMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          SESSIONS_ENDPOINTS.REVOKE({sessionId: params.sessionId}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [SESSIONS.fetchSessionsList.queryKey],
        },
      }),

    useSignOutOtherDevicesMutation: () =>
      useMutationHandler({
        endpoint: SESSIONS_ENDPOINTS.SIGN_OUT_OTHER_DEVICES(),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [SESSIONS.fetchSessionsList.queryKey],
        },
      }),
  };
};
