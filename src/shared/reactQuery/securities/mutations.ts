import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {SECURITIES} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {SECURITIES: SECURITIES_ENDPOINTS} = API_ENDPOINTS;
const {PATCH} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useUpdateOtpMethodsMutation: ({
      params,
    }: {
      params: Record<string, unknown>;
    }) =>
      useMutationHandler({
        endpoint: SECURITIES_ENDPOINTS.UPDATE_OTP_METHODS({
          id: params.id as string,
        }),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [SECURITIES.fetchOtpMethods.queryKey],
        },
      }),
  };
};
