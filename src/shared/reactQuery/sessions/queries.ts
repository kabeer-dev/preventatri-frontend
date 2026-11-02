import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {SESSIONS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchSessionsList: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: SESSIONS.fetchSessionsList.queryKey,
        endpoint: SESSIONS.fetchSessionsList.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {
          ...callBackFuncs,
        },
        mergedToastConfig: {
          toastConfig,
        },
      }),
  };
};
