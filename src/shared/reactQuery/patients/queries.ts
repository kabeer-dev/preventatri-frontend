import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {PATIENTS} from '@/shared/constants/reactQueryConstants';
import {useAllPagesQueryHandler} from '@/shared/hooks/reactQuery/useAllPagesQueryHandler';
import {useInfiniteListQueryHandler} from '@/shared/hooks/reactQuery/useInfiniteListQueryHandler';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';
import {PatientTimelineEntry} from '@/shared/interfaces/patient';

/** Key the patient timeline endpoint returns its rows under. */
const PATIENT_TIMELINE_LIST_KEY = 'timeline';

/** Events per timeline page. */
const PATIENT_TIMELINE_PAGE_SIZE = 25;

/** Key the patients list endpoint returns its rows under. */
const PATIENTS_LIST_KEY = 'patients';

export const useQueries = () => {
  return {
    useFetchPatientsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: PATIENTS.fetchPatientsList.queryKey,
        endpoint: PATIENTS.fetchPatientsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    /**
     * Every patient the caregiver is assigned to, page after page. A picker or
     * a filter has to offer all of them, so it cannot stop at the first page.
     */
    useFetchAllPatients: ({params, enabled}: UseQueryHandlerProps = {}) =>
      useAllPagesQueryHandler({
        queryKey: PATIENTS.fetchPatientsList.queryKey,
        buildEndpoint: PATIENTS.fetchPatientsList.endpoint,
        listKey: PATIENTS_LIST_KEY,
        params,
        enabled,
      }),

    useFetchPatient: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: PATIENTS.fetchPatient.queryKey,
        endpoint: PATIENTS.fetchPatient.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    // The patient's history, a page at a time as the card is scrolled.
    useFetchPatientTimeline: ({
      id,
      enabled,
    }: Pick<UseQueryHandlerProps, 'enabled'> & {id: string}) =>
      useInfiniteListQueryHandler<PatientTimelineEntry>({
        queryKey: PATIENTS.fetchPatientTimeline.queryKey,
        buildEndpoint: PATIENTS.fetchPatientTimeline.endpoint,
        listKey: PATIENT_TIMELINE_LIST_KEY,
        params: {id},
        pageSize: PATIENT_TIMELINE_PAGE_SIZE,
        enabled,
      }),

    useFetchPatientAssessments: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: PATIENTS.fetchPatientAssessments.queryKey,
        endpoint: PATIENTS.fetchPatientAssessments.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchPatientStats: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: PATIENTS.fetchPatientStats.queryKey,
        endpoint: PATIENTS.fetchPatientStats.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
