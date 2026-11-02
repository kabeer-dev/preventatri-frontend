import {REFETCH_MODES} from '@/shared/constants/reactQuery/general';
import {REPORTS} from '@/shared/constants/reactQueryConstants';
import {useQueryHandler} from '@/shared/hooks/reactQuery/useQueryHandler';
import {UseQueryHandlerProps} from '@/shared/interfaces/hooks';
import {
  ReportCoverageResponse,
  ReportHighRiskPatientsResponse,
  ReportOverviewResponse,
  ReportRegionsResponse,
  ReportWorkItemsResponse,
} from '@/shared/interfaces/reports';

// Each section shows its own error with a Retry, so failures are not toasted.
export const useQueries = () => {
  return {
    useFetchReportOverview: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ReportOverviewResponse>({
        queryKey: REPORTS.fetchOverview.queryKey,
        endpoint: REPORTS.fetchOverview.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),

    useFetchReportRegions: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ReportRegionsResponse>({
        queryKey: REPORTS.fetchRegions.queryKey,
        endpoint: REPORTS.fetchRegions.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),

    useFetchReportHighRiskPatients: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ReportHighRiskPatientsResponse>({
        queryKey: REPORTS.fetchHighRiskPatients.queryKey,
        endpoint: REPORTS.fetchHighRiskPatients.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),

    useFetchReportWorkItems: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ReportWorkItemsResponse>({
        queryKey: REPORTS.fetchWorkItems.queryKey,
        endpoint: REPORTS.fetchWorkItems.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),

    useFetchReportCoverage: ({
      callBackFuncs,
      params,
      enabled,
      toastConfig,
    }: UseQueryHandlerProps = {}) =>
      useQueryHandler<ReportCoverageResponse>({
        queryKey: REPORTS.fetchCoverage.queryKey,
        endpoint: REPORTS.fetchCoverage.endpoint({params}),
        params,
        refetchConfig: {mode: REFETCH_MODES.STATIC},
        enabled,
        callbacks: {...callBackFuncs},
        mergedToastConfig: {
          toastConfigAlways: {error: {show: false}},
          toastConfig,
        },
      }),
  };
};
