import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {PATIENTS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {PATIENTS: PATIENTS_ENDPOINTS} = API_ENDPOINTS;
const {POST, PATCH, DELETE} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useCreatePatientMutation: () =>
      useMutationHandler({
        endpoint: PATIENTS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [PATIENTS.fetchPatientsList.queryKey],
        },
      }),

    useUpdatePatientMutation: () =>
      useMutationHandler({
        endpoint: (params) => PATIENTS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },

        // The single record too: the table's edit drawer is filled from it.
        queriesToChangeAlways: {
          refetch: [PATIENTS.fetchPatientsList.queryKey],
          invalidate: [PATIENTS.fetchPatient.queryKey],
        },
      }),

    useDeletePatientMutation: () =>
      useMutationHandler({
        endpoint: (params) => PATIENTS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [PATIENTS.fetchPatientsList.queryKey],
        },
      }),
  };
};
