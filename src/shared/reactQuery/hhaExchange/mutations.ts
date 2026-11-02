import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {
  COUNTIES,
  HHA_SYNC_AFFECTED_QUERY_KEYS,
  HHA_SYNC_HISTORY,
  PATIENTS,
  REGIONS,
} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';
import useTranslation from '@/shared/hooks/useTranslation';

const {HHA_EXCHANGE: HHA_EXCHANGE_ENDPOINTS} = API_ENDPOINTS;
const {POST, PATCH} = HTTP_METHODS;

export const useMutations = () => {
  const {t} = useTranslation();

  return {
    /**
     * Starts the HHAeXchange import. The request only queues the run and
     * returns 202, so there is nothing to refetch here -- a 202 says the run
     * was accepted, not that data changed. The completion socket event drives
     * the refresh; see useHhaSyncSocketEvents.
     */
    useSyncHhaExchangeMutation: () =>
      useMutationHandler({
        endpoint: HHA_EXCHANGE_ENDPOINTS.SYNC(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {
            show: true,
            customMessage: t('hhaSync.queuedMessage'),
          },
        },
      }),

    /** Resolve, dismiss or reopen one exception: {params: {id}, payload: {status, note}}. */
    useUpdateHhaSyncExceptionMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.SYNC_EXCEPTION({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
            HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
          ],
        },
      }),

    /** Give a shared-email person a login email: {params: {userId}, payload: {email}}. */
    useUpdateHhaEmailConflictUserMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.SYNC_EMAIL_CONFLICT_USER({
            userId: params.userId,
          }),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [HHA_SYNC_HISTORY.fetchEmailConflictsList.queryKey],
        },
      }),

    /** Give a not-yet-imported person a login email: {params: {id}, payload: {email}}. */
    useUpdateHhaPendingImportEmailMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.SYNC_EMAIL_CONFLICT_PENDING({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},

        // Saving imports the person at once, so their list changes too.
        queriesToChangeAlways: {
          refetch: [HHA_SYNC_HISTORY.fetchEmailConflictsList.queryKey].concat(
            HHA_SYNC_AFFECTED_QUERY_KEYS
          ),
        },
      }),

    /** Choose a patient's case manager: {params: {patientId}, payload: {caseManagerProfileId}}. */
    useSelectHhaPatientCaseManagerMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.PATIENT_CASE_MANAGER({
            patientId: params.patientId,
          }),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            HHA_SYNC_HISTORY.fetchCoordinatorPatientsList.queryKey,
            PATIENTS.fetchPatient.queryKey,
            PATIENTS.fetchPatientsList.queryKey,
          ],
        },
      }),

    /** Add a "county not set up" exception's county to a region: {params: {id}, payload: {regionId}}. */
    useAddHhaSyncExceptionCountyMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.SYNC_EXCEPTION_COUNTY({id: params.id}),
        method: POST,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
            HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
            REGIONS.fetchRegionsList.queryKey,
            COUNTIES.fetchCountiesList.queryKey,
            PATIENTS.fetchPatient.queryKey,
            PATIENTS.fetchPatientsList.queryKey,
          ],
        },
      }),

    /** Settle a primary nurse conflict: {params: {patientId}, payload: {choice}}. */
    useSelectHhaPatientPrimaryNurseMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.PATIENT_PRIMARY_NURSE({
            patientId: params.patientId,
          }),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
            HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
            PATIENTS.fetchPatient.queryKey,
            PATIENTS.fetchPatientsList.queryKey,
          ],
        },
      }),

    /** Settle a case manager conflict: {params: {patientId}, payload: {choice}}. */
    useSettleHhaPatientCaseManagerConflictMutation: () =>
      useMutationHandler({
        endpoint: (params) =>
          HHA_EXCHANGE_ENDPOINTS.PATIENT_CASE_MANAGER_CONFLICT({
            patientId: params.patientId,
          }),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
            HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
            HHA_SYNC_HISTORY.fetchCoordinatorPatientsList.queryKey,
            PATIENTS.fetchPatient.queryKey,
            PATIENTS.fetchPatientsList.queryKey,
          ],
        },
      }),
  };
};
