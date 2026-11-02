import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {FLAGS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {
  ActiveFlagsResponse,
  FlagCaseDetailsResponse,
  PatientActiveFlagEndpointParams,
} from '@/shared/interfaces/flag';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchActiveFlags: ({
      callBackFuncs,
      enabled,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ActiveFlagsResponse>({
        queryKey: FLAGS.fetchActiveFlags.queryKey,
        endpoint: FLAGS.fetchActiveFlags.endpoint,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: callBackFuncs,
      }),

    useFetchPatientActiveFlag: ({
      params,
      callBackFuncs,
      enabled,
    }: UseQueryHandlerProps & {params: PatientActiveFlagEndpointParams}) =>
      useQueryHandler<ActiveFlagsResponse>({
        queryKey: FLAGS.fetchPatientActiveFlag.queryKey,
        endpoint: FLAGS.fetchPatientActiveFlag.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: callBackFuncs,
      }),

    useFetchFlagCaseDetails: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler<FlagCaseDetailsResponse>({
        queryKey: FLAGS.fetchFlagCaseDetails.queryKey,
        endpoint: FLAGS.fetchFlagCaseDetails.endpoint({
          params: {id},
        }),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},

        // Never show the previous case while the next one loads: after a
        // resolve the popup moves on to the next flag, and keeping the old
        // data made the resolved case look like it came back.
        customQueryOptions: {
          placeholderData: undefined,
        },
        enabled,
        callbacks: callBackFuncs,
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),
  };
};
