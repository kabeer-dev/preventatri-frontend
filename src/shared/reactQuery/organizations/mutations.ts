import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {ORGANIZATIONS, USERS} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';
import useTranslation from '@/shared/hooks/useTranslation';

const {ORGANIZATIONS: ORGANIZATIONS_ENDPOINTS} = API_ENDPOINTS;
const {PATCH, PUT, DELETE} = HTTP_METHODS;

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

    // The logged-in user is refetched too, so the organization's `hhaEnabled`
    // flag and the HHAeXchange menu items follow the connection right away.
    useSaveHhaCredentialsMutation: () =>
      useMutationHandler({
        endpoint: ORGANIZATIONS_ENDPOINTS.SAVE_HHA_CREDENTIALS(),
        method: PUT,
        toastConfigAlways: {
          error: {
            show: true,
            fallbackMessage: t('hhaCredentials.saveError'),
          },
          success: {
            show: true,
            customMessage: t('hhaCredentials.saveSuccess'),
          },
        },
        queriesToChangeAlways: {
          refetch: [
            ORGANIZATIONS.fetchHhaCredentials.queryKey,
            USERS.fetchLoginUserInfo.queryKey,
          ],
        },
      }),

    useDisconnectHhaCredentialsMutation: () =>
      useMutationHandler({
        endpoint: ORGANIZATIONS_ENDPOINTS.DISCONNECT_HHA_CREDENTIALS(),
        method: DELETE,
        toastConfigAlways: {
          error: {
            show: true,
            fallbackMessage: t('hhaCredentials.disconnectError'),
          },
          success: {
            show: true,
            customMessage: t('hhaCredentials.disconnectSuccess'),
          },
        },
        queriesToChangeAlways: {
          refetch: [
            ORGANIZATIONS.fetchHhaCredentials.queryKey,
            USERS.fetchLoginUserInfo.queryKey,
          ],
        },
      }),
  };
};
