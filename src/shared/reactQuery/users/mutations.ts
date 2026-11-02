import {API_ENDPOINTS} from '@/shared/constants/apiEndpoints';
import {HTTP_METHODS} from '@/shared/constants/httpMethods';
import {
  HHA_SYNC_HISTORY,
  USERS as USER_QUERY_CONSTANTS,
} from '@/shared/constants/reactQueryConstants';
import {useMutationHandler} from '@/shared/hooks/reactQuery/useMutationHandler';
import {resetAppState} from '@/shared/hooks/useResetAppState';
import {SwitchOrganizationResponse} from '@/shared/interfaces/auth';
import {useOTPContext} from '@/shared/providers/OTPExecutionProvider';
import {setLanguageCookieInBrowser} from '@/shared/utils/localeUtils';
import {getHomeRoute} from '@/shared/utils/routeUtils';
import {sessionActivityManager} from '@/shared/utils/sessionActivityManager';

const {USERS} = API_ENDPOINTS;
const {POST, PUT, PATCH, DELETE} = HTTP_METHODS;

const runPostSignoutMutation = () => {
  sessionActivityManager.markLogout();
  resetAppState();
};

// Keeping it outside of useMutations() because it is also used in useSessionTimeout hook and there we don't have access to the OTP context, so we can't define it inside useMutations. useMutation consumes the context and it's not available in that hook.
export const useSignOutMutation = () =>
  useMutationHandler({
    endpoint: USERS.LOGOUT(),
    method: POST,
    callBackFuncs: {
      onSuccessAlways: runPostSignoutMutation,
      onErrorAlways: runPostSignoutMutation,
    },
  });

export const useMutations = () => {
  const {setOtpToken} = useOTPContext();

  // Single invite entry point for every role. The backend picks the body schema
  // and controller from userType, so the role only changes the query string.
  const useInviteUserMutation = ({userType}: {userType: string}) =>
    useMutationHandler({
      endpoint: USERS.INVITE({userType}),
      method: POST,
      toastConfigAlways: {
        error: {show: true},
        success: {show: false},
      },
      queriesToChangeAlways: {
        refetch: [USER_QUERY_CONSTANTS.fetchOrgUsersList.queryKey],
      },
    });

  return {
    useInviteUserMutation,
    useLoginMutation: () =>
      useMutationHandler({
        endpoint: USERS.LOGIN(),
        method: POST,
        callBackFuncs: {
          onSuccessAlways: ({
            data: {user},

            // statusCode,
            // message
          } = {}) => {
            if (user) setLanguageCookieInBrowser({language: user.language});
          },

          onErrorAlways: (
            {
              // error : {type},
              // message,
              // statusCode
            }
          ) => {},
        },
        toastConfigAlways: {
          error: {
            show: true,

            // customMessage: 'Login failed!', // optional will use backend message if not provided
          },
          success: {
            show: true,

            // customMessage: 'Login successful!', // optional will use backend message if not provided
          },
        },

        // queriesToChangeAlways: {
        //   refetch: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey],

        //   invalidate: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey], // this is just a sample on what can be done
        // },
      }),

    useSignupMutation: () =>
      useMutationHandler({
        endpoint: USERS.SIGNUP(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
      }),

    useResetPasswordMutation: () =>
      useMutationHandler({
        endpoint: USERS.RESET_PASSWORD,
        method: PATCH,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
      }),

    useAcceptInvitationMutation: () =>
      useMutationHandler({
        endpoint: USERS.VERIFY_INVITED_USER,
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
      }),

    // Runs from the emailed link with no login. The page shows the outcome
    // itself, so no toasts.
    useAcceptOrganizationInvitationMutation: () =>
      useMutationHandler({
        endpoint: USERS.ACCEPT_ORGANIZATION_INVITATION,
        method: POST,
        toastConfigAlways: {
          error: {show: false},
          success: {show: false},
        },
      }),

    useRegeneratePublicOTPMutation: () =>
      useMutationHandler({
        endpoint: USERS.REGENERATE_PUBLIC_OTP(),
        method: POST,
        callBackFuncs: {
          onSuccessAlways: ({data}) => {
            const {token} = data;
            setOtpToken({otpToken: token});
          },
        },
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
      }),

    useRegeneratePrivateOTPMutation: () =>
      useMutationHandler({
        endpoint: USERS.REGENERATE_PRIVATE_OTP(),
        method: POST,
        callBackFuncs: {
          onSuccessAlways: ({data}) => {
            const {token} = data;
            setOtpToken({otpToken: token});
          },
        },
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
      }),

    useResendVerificationMutation: () =>
      useMutationHandler({
        endpoint: USERS.RESEND_VERIFICATION(),
        method: POST,
      }),

    useResendInvitationMutation: () =>
      useMutationHandler({
        endpoint: USERS.RESEND_INVITATION(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },

        // HHA Sync exceptions and shared emails show each person's invitation status.
        queriesToChangeAlways: {
          refetch: [
            USER_QUERY_CONSTANTS.fetchOrgUsersList.queryKey,
            HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
            HHA_SYNC_HISTORY.fetchEmailConflictsList.queryKey,
          ],
        },
      }),

    // No success toast: the caller shows who was sent and who was skipped.
    useBulkInvitationMutation: () =>
      useMutationHandler({
        endpoint: USERS.BULK_INVITATION(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchOrgUsersList.queryKey],
        },
      }),

    useRevokeInvitationMutation: () =>
      useMutationHandler({
        endpoint: USERS.REVOKE_INVITATION(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchOrgUsersList.queryKey],
        },
      }),

    useUpdateProfileMutation: () =>
      useMutationHandler({
        endpoint: USERS.UPDATE_PROFILE(),
        method: PATCH,
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey],
        },
      }),

    useUploadProfileImageMutation: () =>
      useMutationHandler({
        endpoint: USERS.UPLOAD_PROFILE_IMAGE(),
        method: POST,
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey],
        },
      }),

    useUpdateProfileImageMutation: () =>
      useMutationHandler({
        endpoint: USERS.UPDATE_PROFILE_IMAGE(),
        method: PUT,
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey],
        },
      }),

    useDeleteProfileImageMutation: () =>
      useMutationHandler({
        endpoint: USERS.DELETE_PROFILE_IMAGE(),
        method: DELETE,
        toastConfigAlways: {
          error: {
            show: true,
          },
          success: {
            show: true,
          },
        },
        queriesToChangeAlways: {
          refetch: [USER_QUERY_CONSTANTS.fetchLoginUserInfo.queryKey],
        },
      }),

    useVerifyUserMutation: () =>
      useMutationHandler({
        endpoint: USERS.VERIFY,
        method: POST,
      }),

    useSendResetPasswordMutation: () =>
      useMutationHandler({
        endpoint: USERS.SEND_RESET_PASSWORD(),
        method: POST,
      }),

    useSignOutMutation,

    // The new token is set by the response. Everything on screen belongs to the
    // old organization, so the app reloads on the new role's home screen
    // instead of patching caches and sockets one by one.
    useSwitchOrganizationMutation: () =>
      useMutationHandler({
        endpoint: USERS.SWITCH_ORGANIZATION(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: false},
        },
        callBackFuncs: {
          onSuccessAlways: ({
            data,
          }: {data?: SwitchOrganizationResponse} = {}) => {
            window.location.assign(
              getHomeRoute({role: data?.organization?.role})
            );
          },
        },
      }),

    useUpdateLanguageMutation: () =>
      useMutationHandler({
        endpoint: USERS.UPDATE_USER_LANGUAGE(),
        method: PATCH,
      }),

    useSendUnlockEmailMutation: () =>
      useMutationHandler({
        endpoint: USERS.SEND_UNLOCK_EMAIL(),
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
      }),

    useUnlockAccountMutation: () =>
      useMutationHandler({
        endpoint: USERS.UNLOCK_ACCOUNT,
        method: POST,
        toastConfigAlways: {
          error: {show: true},
          success: {show: true},
        },
      }),
  };
};
