import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {
  HHA_SYNC,
  HHA_SYNC_HISTORY,
} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    /**
     * Is a run queued or in flight? STATIC and read once on mount, so a page
     * loaded mid-run shows the button as busy. Deliberately not polled: that
     * would defeat the app's idle-timeout detection.
     *
     * Errors are silent -- the cost is a button that looks idle and 409s.
     */
    useFetchHhaSyncStatus: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC.fetchHhaSyncStatus.queryKey,
        endpoint: HHA_SYNC.fetchHhaSyncStatus.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),

    // The HHA Sync page. STATIC: history only moves when a run finishes, and
    // the completion socket invalidates these keys (HHA_SYNC_AFFECTED_QUERY_KEYS).
    useFetchHhaSyncRunsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchSyncRunsList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchSyncRunsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaSyncRun: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchSyncRun.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchSyncRun.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaSyncChangesList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchSyncChangesList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchSyncChangesList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaSyncExceptionsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchSyncExceptionsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaEmailConflictsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchEmailConflictsList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchEmailConflictsList.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaCoordinatorPatientsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchCoordinatorPatientsList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchCoordinatorPatientsList.endpoint({
          params,
        }),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    /** The patients waiting for the person a per-person exception names. */
    useFetchHhaWaitingPatientsList: ({
      id,
      params,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchWaitingPatientsList.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchWaitingPatientsList.endpoint({
          id,
          params,
        }),
        params: Object.assign({id}, params),
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchHhaSyncExceptionCounts: ({
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
        endpoint: HHA_SYNC_HISTORY.fetchSyncExceptionCounts.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: Object.assign({}, callBackFuncs),
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),
  };
};
