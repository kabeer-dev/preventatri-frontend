import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {REGIONS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {REGIONS: REGIONS_ENDPOINTS} = API_ENDPOINTS;
const {POST, PATCH, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useCreateRegionMutation: () =>
      useMutationHandler({
        endpoint: REGIONS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [REGIONS.fetchRegionsList.queryKey],
        },
      }),

    useUpdateRegionMutation: () =>
      useMutationHandler({
        endpoint: (params) => REGIONS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [REGIONS.fetchRegionsList.queryKey],
        },
      }),

    useDeleteRegionMutation: () =>
      useMutationHandler({
        endpoint: (params) => REGIONS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [REGIONS.fetchRegionsList.queryKey],
        },
      }),
  };
};
