import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {AUDIT_LOGS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {AuditLogListResponse} from '@/shared/interfaces/activityLog';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchActivityLogList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<AuditLogListResponse>({
        queryKey: AUDIT_LOGS.fetchAuditLogsList.queryKey,
        endpoint: AUDIT_LOGS.fetchAuditLogsList.endpoint({params}),
        params,
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
