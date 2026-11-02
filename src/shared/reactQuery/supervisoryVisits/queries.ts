import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {SUPERVISORY_VISITS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';

export const useQueries = () => {
  return {
    useFetchSupervisoryVisitsList: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler({
        queryKey: SUPERVISORY_VISITS.fetchSupervisoryVisitsList.queryKey,
        endpoint: SUPERVISORY_VISITS.fetchSupervisoryVisitsList.endpoint({
          params,
        }),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    useFetchSupervisoryVisit: ({
      id,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {id: string}) =>
      useQueryHandler({
        queryKey: SUPERVISORY_VISITS.fetchSupervisoryVisit.queryKey,
        endpoint: SUPERVISORY_VISITS.fetchSupervisoryVisit.endpoint({id}),
        params: {id},
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: true}},
          toastConfig,
        },
      }),

    // The patient's care team: the assigned nurse and caregivers present are
    // both picked from it.
    useFetchSupervisoryVisitAssignees: ({
      patientId,
      callBackFuncs,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps & {patientId: string}) =>
      useQueryHandler({
        queryKey: SUPERVISORY_VISITS.fetchSupervisoryVisitAssignees.queryKey,
        endpoint: SUPERVISORY_VISITS.fetchSupervisoryVisitAssignees.endpoint({
          params: {patientId},
        }),
        params: {patientId},
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
