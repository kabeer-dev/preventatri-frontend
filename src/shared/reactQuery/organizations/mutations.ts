import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {ORGANIZATIONS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';
import useTranslation from '@/shared/hooks/useTranslation';

const {ORGANIZATIONS: ORGANIZATIONS_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, PUT} = HTTP_METHODS;

export const useMutations = () => {
  const {t} = useTranslation();

  return {
    useUpdateWorkingHoursMutation: () =>
      useMutationHandler({
        endpoint: ORGANIZATIONS_ENDPOINTS.UPDATE_WORKING_HOURS(),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [ORGANIZATIONS.fetchWorkingHours.queryKey],
        },
      }),

    useUpdateTimeZoneMutation: () =>
      useMutationHandler({
        endpoint: ORGANIZATIONS_ENDPOINTS.UPDATE_TIME_ZONE(),
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [ORGANIZATIONS.fetchTimeZone.queryKey],
        },
      }),

    useUpdateEscalationPolicyMutation: () =>
      useMutationHandler({
        endpoint: ({flag}: {flag: string}) =>
          ORGANIZATIONS_ENDPOINTS.UPDATE_ESCALATION_POLICY({flag}),
        method: PUT,
        toastConfigAlways: {
          error: {
            show: true,
            fallbackMessage: t('escalationSettings.saveError'),
          },
          success: {
            show: true,
            fallbackMessage: t('escalationSettings.saveSuccess'),
          },
        },
        queriesToChangeAlways: {
          refetch: [ORGANIZATIONS.fetchEscalationPolicies.queryKey],
        },
      }),
  };
};
