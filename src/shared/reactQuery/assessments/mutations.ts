import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {
  ASSESSMENTS,
  PATIENTS,
  EMERGENCY_FLAGS,
  SUBMISSIONS,
} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';

const {
  ASSESSMENTS: ASSESSMENTS_ENDPOINTS,
  SUBMISSIONS: SUBMISSIONS_ENDPOINTS,
  EMERGENCY_FLAGS: EMERGENCY_FLAGS_ENDPOINTS,
} = API_ENDPOINTS;

const {POST, PATCH, DELETE} = HTTP_METHODS;

const TEMPLATE_QUERY_KEYS = [
  ASSESSMENTS.fetchAssessmentTemplatesList.queryKey,
  ASSESSMENTS.fetchAssessmentTemplate.queryKey,
];

export const useMutations = () => {
  return {
    useCreateAssessmentTemplateMutation: () =>
      useMutationHandler({
        endpoint: ASSESSMENTS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [ASSESSMENTS.fetchAssessmentTemplatesList.queryKey],
        },
      }),

    useUpdateAssessmentTemplateMutation: () =>
      useMutationHandler({
        endpoint: (params) => ASSESSMENTS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {refetch: TEMPLATE_QUERY_KEYS},
      }),

    useUpdateAssessmentTemplateStatusMutation: () =>
      useMutationHandler({
        endpoint: (params) => ASSESSMENTS_ENDPOINTS.STATUS({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {refetch: TEMPLATE_QUERY_KEYS},
      }),

    useDeleteAssessmentTemplateMutation: () =>
      useMutationHandler({
        endpoint: (params) => ASSESSMENTS_ENDPOINTS.DELETE({id: params.id}),
        method: DELETE,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [ASSESSMENTS.fetchAssessmentTemplatesList.queryKey],
        },
      }),

    useCreateSubmissionMutation: () =>
      useMutationHandler({
        endpoint: SUBMISSIONS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [SUBMISSIONS.fetchSubmissionsList.queryKey],
        },
      }),

    useUpdateSubmissionMutation: () =>
      useMutationHandler({
        endpoint: (params) => SUBMISSIONS_ENDPOINTS.UPDATE({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            SUBMISSIONS.fetchSubmissionsList.queryKey,
            PATIENTS.fetchPatientAssessments.queryKey,
          ],
        },
      }),

    useVoidSubmissionMutation: () =>
      useMutationHandler({
        endpoint: (params) => SUBMISSIONS_ENDPOINTS.VOID({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            SUBMISSIONS.fetchSubmissionsList.queryKey,
            SUBMISSIONS.fetchSubmission.queryKey,
          ],
        },
      }),

    useSkipSubmissionMutation: () =>
      useMutationHandler({
        endpoint: (params) => SUBMISSIONS_ENDPOINTS.SKIP({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [
            SUBMISSIONS.fetchSubmissionsList.queryKey,
            SUBMISSIONS.fetchSubmission.queryKey,
          ],
        },
      }),

    useCreateEmergencyFlagMutation: () =>
      useMutationHandler({
        endpoint: EMERGENCY_FLAGS_ENDPOINTS.CREATE(),
        method: POST,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey],
        },
      }),

    useVoidEmergencyFlagMutation: () =>
      useMutationHandler({
        endpoint: (params) => EMERGENCY_FLAGS_ENDPOINTS.VOID({id: params.id}),
        method: PATCH,
        toastConfigAlways: {error: {show: true}, success: {show: true}},
        queriesToChangeAlways: {
          refetch: [EMERGENCY_FLAGS.fetchEmergencyFlagsList.queryKey],
        },
      }),
  };
};
