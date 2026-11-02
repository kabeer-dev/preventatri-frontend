import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {
  ASSESSMENTS,
  EMERGENCY_FLAGS,
  SUBMISSIONS,
} from '@/shared/constants/reactQueryConstants';
import {useAllPagesQueryHandler} from '@/shared/hooks/reactQuery/useAllPagesQueryHandler';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {
  AssessmentTemplateQueryParams,
  AssessmentTemplateResponse,
} from '@/shared/interfaces/assessmentChecklist';
import {EmergencyFlagsListResponse} from '@/shared/interfaces/emergencyFlag';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

/** Keys the two list endpoints return their rows under. */
const SUBMISSIONS_LIST_KEY = 'submissions';

const EMERGENCY_FLAGS_LIST_KEY = 'emergencyFlags';

export const useQueries = () => {
  return {
    useFetchAssessmentTemplatesList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: ASSESSMENTS.fetchAssessmentTemplatesList.queryKey,
        endpoint: ASSESSMENTS.fetchAssessmentTemplatesList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchSubmissionsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: SUBMISSIONS.fetchSubmissionsList.queryKey,
        endpoint: SUBMISSIONS.fetchSubmissionsList.endpoint({params}),
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
     * Every submission the filters match, not the first page of them. The
     * caregiver's own screens count late work off this list, so a second page
     * left behind would show her a number that is simply wrong.
     */
    useFetchAllSubmissions: ({params, enabled}: UseQueryHandlerProps = {}) =>
      useAllPagesQueryHandler({
        queryKey: SUBMISSIONS.fetchSubmissionsList.queryKey,
        buildEndpoint: SUBMISSIONS.fetchSubmissionsList.endpoint,
        listKey: SUBMISSIONS_LIST_KEY,
        params,
        enabled,
      }),

    useFetchSubmission: ({
      id,
      params,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: SUBMISSIONS.fetchSubmission.queryKey,
        endpoint: SUBMISSIONS.fetchSubmission.endpoint({id, params}),
        params: {...params, id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchAssessmentTemplate: ({
      id,
      params,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {
      id: string;
      params?: AssessmentTemplateQueryParams;
    }) =>
      useQueryHandler<AssessmentTemplateResponse>({
        queryKey: ASSESSMENTS.fetchAssessmentTemplate.queryKey,
        endpoint: ASSESSMENTS.fetchAssessmentTemplate.endpoint({id, params}),
        params: {id, ...params},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchEmergencyFlagsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<EmergencyFlagsListResponse>({
        queryKey: EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey,
        endpoint: EMERGENCY_FLAGS.fetchEmergencyFlagsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    /** Every emergency flag the filters match, page after page. */
    useFetchAllEmergencyFlags: ({params, enabled}: UseQueryHandlerProps = {}) =>
      useAllPagesQueryHandler<EmergencyFlagsListResponse>({
        queryKey: EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey,
        buildEndpoint: EMERGENCY_FLAGS.fetchEmergencyFlagsList.endpoint,
        listKey: EMERGENCY_FLAGS_LIST_KEY,
        params,
        enabled,
      }),

    useFetchEmergencyFlag: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: EMERGENCY_FLAGS.fetchEmergencyFlag.queryKey,
        endpoint: EMERGENCY_FLAGS.fetchEmergencyFlag.endpoint({id}),
        params: {id},
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
