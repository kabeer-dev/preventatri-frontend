import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {
  EMERGENCY_FLAGS,
  FLAGS,
  TRIAGE_ENGINE,
} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {FLAGS: FLAGS_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, POST} = HTTP_METHODS;

export const useMutations = () => {
  return {
    useResolveFlagCaseDemoMutation: () =>
      useMutationHandler({
        endpoint: ({id}: {id: string}) => FLAGS_ENDPOINTS.RESOLVE({id}),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },

        // Every view that offers this flag is refreshed, so a resolved flag
        // cannot be opened and resolved again from a stale screen.
        queriesToChangeAlways: {
          refetch: [FLAGS.fetchActiveFlags.queryKey],
          invalidate: [
            FLAGS.fetchPatientActiveFlag.queryKey,
            EMERGENCY_FLAGS.fetchEmergencyFlag.queryKey,
            EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey,
            TRIAGE_ENGINE.fetchAlerts.queryKey,
          ],
        },
      }),

    // Accepting stops the escalation, so every place that shows the flag's
    // status or timer is refreshed.
    useAcceptFlagMutation: () =>
      useMutationHandler({
        endpoint: ({id}: {id: string}) => FLAGS_ENDPOINTS.ACCEPT({id}),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [FLAGS.fetchActiveFlags.queryKey],
          invalidate: [
            EMERGENCY_FLAGS.fetchEmergencyFlag.queryKey,
            EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey,
            TRIAGE_ENGINE.fetchAlerts.queryKey,
          ],
        },
      }),
  };
};
