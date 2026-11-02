import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {USERS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    // Function to fetch the logged-in user info
    useFetchLoginUserInfo: ({
      callBackFuncs,
      enabled,

      // toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: USERS.fetchLoginUserInfo.queryKey,
        endpoint: USERS.fetchLoginUserInfo.endpoint,
        refetchConfig: {
          mode: REFETCH_MODES.STATIC,
        },

        // The logged-in user is read by several components that mount in
        // sequence during hydration (AuthGuard -> RoleGuard -> page/dropdown).
        // With the global `refetchOnMount: 'always'`, each sequential mount
        // refetches `/users/me`, firing it ~3x per page load. Overriding just
        // this query to `true` lets the later mounts read the still-fresh
        // cache (staleTime), collapsing it to a single request, while leaving
        // the global `'always'` default untouched for every other query.
        customQueryOptions: {
          refetchOnMount: true,
        },
        enabled,
        callbacks: {
          ...callBackFuncs,
          onSuccessAlways: ({
            // data,
            // statusCode,
            // message
          } = {}) => {},
          onErrorAlways: (
            {
              // error : {type},
              // message,
              // statusCode
            }
          ) => {},
        },

        // mergedToastConfig: {
        //   toastConfig,
        //   toastConfigAlways: {
        //     error: {
        //       // this is just a sample on what can be done as it's already done in the mutation itself
        //       show: true,

        //       // customMessage: 'Success!', // optional will use backend message if not provided
        //     },
        //     success: {
        //       // this is just a sample on what can be done as it's already done in the mutation itself
        //       show: true,

        //       // customMessage: 'Failure!', // optional will use backend message if not provided
        //     },
        //   },
        // },
      }),

    // The organizations the person can switch to; the menu hides the switcher
    // when there is only one.
    useFetchMyOrganizations: ({enabled}: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: USERS.fetchMyOrganizations.queryKey,
        endpoint: USERS.fetchMyOrganizations.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
      }),

    // Unified Users & Roles roster: nurses, caregivers and case managers in
    // one server-filtered, server-paginated list.
    useFetchOrgUsersList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: USERS.fetchOrgUsersList.queryKey,
        endpoint: USERS.fetchOrgUsersList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
