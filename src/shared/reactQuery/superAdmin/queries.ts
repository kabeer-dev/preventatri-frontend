import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {SUPER_ADMIN} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchManagedOrganizations: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: SUPER_ADMIN.fetchOrganizationsList.queryKey,
        endpoint: SUPER_ADMIN.fetchOrganizationsList.endpoint({params}),
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
