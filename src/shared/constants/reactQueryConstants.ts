import {AssessmentTemplateQueryParams} from '@/shared/interfaces/assessmentChecklist';
import {AdminStatsTrendsParams} from '@/shared/interfaces/dashboard';
import {
  FlagCaseDetailsEndpointParams,
  PatientActiveFlagEndpointParams,
} from '@/shared/interfaces/flag';
import {HhaSyncListParams} from '@/shared/interfaces/hhaSyncHistory';
import {NotificationsListParams} from '@/shared/interfaces/notification';
import {
  ReportApiParams,
  ReportCoverageParams,
} from '@/shared/interfaces/reports';
import {GlobalSearchParams} from '@/shared/interfaces/search';
import {ManagedOrganizationsParams} from '@/shared/interfaces/superAdmin';
import {TriageAlertsParams} from '@/shared/interfaces/triageEngine';
import {buildDynamicURL} from '@/shared/utils/buildDynamicURL';

import {API_ENDPOINTS} from './apiEndpoints';

export const FILTERS_CONFIG = {
  number: 1,
  limit: 10,
  search: '',
  sortBy: '',
  sortDir: '',
};

/**
 * Unique URL-key namespaces for list-filter instances that share a page.
 * Each embedded table needs its own prefix so its pagination/sort/search
 * query params don't collide with the other tables rendered alongside it.
 */
export const LIST_INSTANCE_KEYS = {
  patientRedFlags: 'patientRedFlags',
  patientChecklistReports: 'patientChecklistReports',
  caregiverRedFlags: 'caregiverRedFlags',
  caregiverChecklistReports: 'caregiverChecklistReports',
  caregiverPatients: 'caregiverPatients',
};

/**
 * Spread into a query's `params`/`baseParams` whenever the fetch happens
 * inside a nested/embedded view (a widget, modal or detail-page table)
 * rather than the entity's own standalone list page.
 */
export const SUB_ROUTE_PARAMS = {isSubRoute: true};

export const USERS = {
  fetchLoginUserInfo: {
    queryKey: 'getLoginUser',
    endpoint: API_ENDPOINTS.USERS.GET_LOGIN_USER(),
  },
  fetchMyOrganizations: {
    queryKey: 'getMyOrganizations',
    endpoint: API_ENDPOINTS.USERS.MY_ORGANIZATIONS(),
  },
  fetchOrgUsersList: {
    queryKey: 'getOrgUsersList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.USERS.GET_USERS_LIST(),
        params,
      }),
    activeServerSidePagination: true,
  },
};

export const REGIONS = {
  fetchRegionsList: {
    queryKey: 'getRegionsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REGIONS.LIST(),
        params,
      }),
  },
  fetchActiveRegionsList: {
    queryKey: 'getActiveRegionsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REGIONS.LIST(),
        params: {...params, isActive: true},
      }),
  },
};

export const NURSES = {
  fetchNursesList: {
    queryKey: 'getNursesList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.NURSES.LIST(),
        params,
      }),
  },
  fetchNurse: {
    queryKey: 'getNurse',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.NURSES.GET({id}),
  },
  fetchNurseAdminStats: {
    queryKey: 'getNurseAdminStats',
    endpoint: API_ENDPOINTS.NURSES.ADMIN_STATS(),
  },
  fetchNurseDashboard: {
    queryKey: 'getNurseDashboard',
    endpoint: API_ENDPOINTS.NURSES.DASHBOARD(),
  },
};

export const PATIENTS = {
  fetchPatientsList: {
    queryKey: 'getPatientsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.PATIENTS.LIST(),
        params,
      }),
  },
  fetchPatient: {
    queryKey: 'getPatient',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.PATIENTS.GET({id}),
  },
  fetchPatientAssessments: {
    queryKey: 'getPatientAssessments',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.PATIENTS.ASSESSMENTS({id}),
  },

  // Paged, newest first. `id` is the patient; the rest is page and limit.
  fetchPatientTimeline: {
    queryKey: 'getPatientTimeline',
    endpoint: ({params}: {params: {id: string; [key: string]: unknown}}) => {
      const {id, ...query} = params;

      return buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.PATIENTS.TIMELINE({id}),
        params: query,
      });
    },
  },
  fetchPatientStats: {
    queryKey: 'getPatientStats',
    endpoint: API_ENDPOINTS.PATIENTS.STATS(),
  },
};

export const ASSESSMENTS = {
  fetchAssessmentTemplatesList: {
    queryKey: 'getAssessmentTemplatesList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.ASSESSMENTS.LIST(),
        params,
      }),
  },
  fetchAssessmentTemplate: {
    queryKey: 'getAssessmentTemplate',
    endpoint: ({
      id,
      params,
    }: {
      id: string;
      params?: AssessmentTemplateQueryParams;
    }) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.ASSESSMENTS.GET({id}),
        params: params ?? {},
      }),
  },
};

export const CHECKLIST_ASSIGNMENTS = {
  fetchChecklistAssignmentsList: {
    queryKey: 'getChecklistAssignmentsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.CHECKLIST_ASSIGNMENTS.LIST(),
        params,
      }),
  },
};

export const COUNTIES = {
  fetchCountiesList: {
    queryKey: 'getCountiesList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.COUNTIES.LIST(),
        params,
      }),
  },

  // Every US county, not this organization's own list.
  fetchReferenceCountiesList: {
    queryKey: 'getReferenceCountiesList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.COUNTIES.REFERENCE_LIST(),
        params,
      }),
  },
};

export const CAREGIVERS = {
  fetchCaregiversList: {
    queryKey: 'getCaregiversList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.CAREGIVERS.LIST(),
        params,
      }),
  },
  fetchCaregiver: {
    queryKey: 'getCaregiver',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.CAREGIVERS.GET({id}),
  },
  fetchCaregiverStatistics: {
    queryKey: 'getCaregiverStatistics',
    endpoint: ({id, params}: {id: string; params?: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.CAREGIVERS.STATISTICS({id}),
        params: params ?? {},
      }),
  },
  fetchCaregiverAdminStats: {
    queryKey: 'getCaregiverAdminStats',
    endpoint: API_ENDPOINTS.CAREGIVERS.ADMIN_STATS(),
  },
  fetchCaregiverStats: {
    queryKey: 'getCaregiverStats',
    endpoint: API_ENDPOINTS.CAREGIVERS.STATS(),
  },
};

export const SUBMISSIONS = {
  fetchSubmissionsList: {
    queryKey: 'getSubmissionsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.SUBMISSIONS.LIST(),
        params,
      }),
  },
  fetchSubmission: {
    queryKey: 'getSubmission',
    endpoint: ({id, params}: {id: string; params?: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.SUBMISSIONS.GET({id}),
        params: params ?? {},
      }),
  },
};

export const EMERGENCY_FLAGS = {
  fetchEmergencyFlagsList: {
    queryKey: 'getEmergencyFlagsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.EMERGENCY_FLAGS.LIST(),
        params,
      }),
  },
  fetchEmergencyFlag: {
    queryKey: 'getEmergencyFlag',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.EMERGENCY_FLAGS.GET({id}),
  },
};

export const FLAGS = {
  fetchActiveFlags: {
    queryKey: 'getActiveFlags',
    endpoint: API_ENDPOINTS.FLAGS.LIST_ACTIVE(),
  },

  // Same endpoint narrowed to one patient. It shares the active-flags key so
  // every place that refreshes the active flag (resolve, socket) refreshes
  // this one too.
  fetchPatientActiveFlag: {
    queryKey: 'getActiveFlags',
    endpoint: ({params}: {params: PatientActiveFlagEndpointParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.FLAGS.LIST_ACTIVE(),
        params,
      }),
  },
  fetchFlagCaseDetails: {
    queryKey: 'getFlagCaseDetails',
    endpoint: ({params}: {params: FlagCaseDetailsEndpointParams}) =>
      API_ENDPOINTS.FLAGS.CASE_DETAILS({id: params.id}),
  },
};

export const SUPERVISORY_VISITS = {
  fetchSupervisoryVisitsList: {
    queryKey: 'getSupervisoryVisitsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.SUPERVISORY_VISITS.LIST(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchSupervisoryVisit: {
    queryKey: 'getSupervisoryVisit',
    endpoint: ({id}: {id: string}) =>
      API_ENDPOINTS.SUPERVISORY_VISITS.GET({id}),
  },
  fetchSupervisoryVisitAssignees: {
    queryKey: 'getSupervisoryVisitAssignees',
    endpoint: ({params}: {params: {patientId: string}}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.SUPERVISORY_VISITS.ASSIGNEES(),
        params,
      }),
  },
};

export const HHA_VISITS = {
  fetchHhaVisitsList: {
    queryKey: 'getHhaVisitsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.VISITS(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchHhaVisit: {
    queryKey: 'getHhaVisit',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.HHA_EXCHANGE.VISIT({id}),
  },
};

export const FOLLOW_UP_TASKS = {
  fetchFollowUpTasksList: {
    queryKey: 'getFollowUpTasksList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.FOLLOW_UP_TASKS.LIST(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchFollowUpTask: {
    queryKey: 'getFollowUpTask',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.FOLLOW_UP_TASKS.GET({id}),
  },
  fetchFollowUpAssignees: {
    queryKey: 'getFollowUpAssignees',
    endpoint: ({params}: {params: {patientId: string}}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.FOLLOW_UP_TASKS.ASSIGNEES(),
        params,
      }),
  },
};

export const DASHBOARD = {
  fetchAdminStats: {
    queryKey: 'getAdminDashboardStats',
    endpoint: API_ENDPOINTS.DASHBOARD.ADMIN_STATS(),
  },
  fetchAdminStatsTrends: {
    queryKey: 'getAdminDashboardStatsTrends',
    endpoint: ({params}: {params: AdminStatsTrendsParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.DASHBOARD.ADMIN_STATS_TRENDS(),
        params,
      }),
  },
};

export const REPORTS = {
  fetchOverview: {
    queryKey: 'getReportOverview',
    endpoint: ({params}: {params: ReportApiParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REPORTS.OVERVIEW(),
        params,
      }),
  },
  fetchRegions: {
    queryKey: 'getReportRegions',
    endpoint: ({params}: {params: ReportApiParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REPORTS.REGIONS(),
        params,
      }),
  },
  fetchHighRiskPatients: {
    queryKey: 'getReportHighRiskPatients',
    endpoint: ({params}: {params: ReportApiParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REPORTS.HIGH_RISK_PATIENTS(),
        params,
      }),
  },
  fetchWorkItems: {
    queryKey: 'getReportWorkItems',
    endpoint: ({params}: {params: ReportApiParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REPORTS.WORK_ITEMS(),
        params,
      }),
  },
  fetchCoverage: {
    queryKey: 'getReportCoverage',
    endpoint: ({params}: {params: ReportCoverageParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.REPORTS.COVERAGE(),
        params,
      }),
  },
};

export const TRIAGE_ENGINE = {
  fetchStats: {
    queryKey: 'getTriageEngineStats',
    endpoint: API_ENDPOINTS.TRIAGE_ENGINE.STATS(),
  },
  fetchAlerts: {
    queryKey: 'getTriageEngineAlerts',
    endpoint: ({params}: {params: TriageAlertsParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.TRIAGE_ENGINE.ALERTS(),
        params,
      }),
  },
};

export const NOTIFICATIONS = {
  fetchNotifications: {
    queryKey: 'getNotifications',
    endpoint: ({params}: {params: NotificationsListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.NOTIFICATIONS.LIST(),
        params,
      }),
  },

  // Every user's notifications in the organization (admin only). Its key must
  // not start with fetchNotifications' key: the read-state cache patch matches
  // that one by prefix and only applies to the viewer's own list.
  fetchAllNotifications: {
    queryKey: 'getAllNotifications',
    endpoint: ({params}: {params: NotificationsListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.NOTIFICATIONS.LIST_ALL(),
        params,
      }),
  },
};

export const CASE_MANAGERS = {
  fetchCaseManagersList: {
    queryKey: 'getCaseManagersList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.CASE_MANAGERS.LIST(),
        params,
      }),
  },
  fetchCaseManager: {
    queryKey: 'getCaseManager',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.CASE_MANAGERS.GET({id}),
  },
  fetchCaseManagerAdminStats: {
    queryKey: 'getCaseManagerAdminStats',
    endpoint: API_ENDPOINTS.CASE_MANAGERS.ADMIN_STATS(),
  },
  fetchCaseManagerDashboard: {
    queryKey: 'getCaseManagerDashboard',
    endpoint: API_ENDPOINTS.CASE_MANAGERS.DASHBOARD(),
  },
  fetchAvailablePatients: {
    queryKey: 'getCaseManagerAvailablePatients',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.CASE_MANAGERS.AVAILABLE_PATIENTS(),
        params,
      }),
  },
};

export const HHA_SYNC_HISTORY = {
  fetchSyncRunsList: {
    queryKey: 'getHhaSyncRunsList',
    endpoint: ({params}: {params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_RUNS(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchSyncRun: {
    queryKey: 'getHhaSyncRun',
    endpoint: ({id}: {id: string}) => API_ENDPOINTS.HHA_EXCHANGE.SYNC_RUN({id}),
  },
  fetchSyncChangesList: {
    queryKey: 'getHhaSyncChangesList',
    endpoint: ({params}: {params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_CHANGES(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchSyncExceptionsList: {
    queryKey: 'getHhaSyncExceptionsList',
    endpoint: ({params}: {params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_EXCEPTIONS(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchSyncExceptionCounts: {
    queryKey: 'getHhaSyncExceptionCounts',
    endpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_EXCEPTION_COUNTS(),
  },
  fetchEmailConflictsList: {
    queryKey: 'getHhaEmailConflictsList',
    endpoint: ({params}: {params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_EMAIL_CONFLICTS(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchCoordinatorPatientsList: {
    queryKey: 'getHhaCoordinatorPatientsList',
    endpoint: ({params}: {params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_COORDINATORS(),
        params,
      }),
    activeServerSidePagination: true,
  },
  fetchWaitingPatientsList: {
    queryKey: 'getHhaWaitingPatientsList',
    endpoint: ({id, params}: {id: string; params: HhaSyncListParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_EXCEPTION_PATIENTS({id}),
        params,
      }),
  },
};

/**
 * Every query an HHAeXchange sync run can invalidate. One run imports every
 * resource, so a sync started from Patients can still change the caregiver,
 * case-manager, nurse and visit lists.
 *
 * Here rather than in the sync mutation, which no longer knows when the data
 * changed -- the completion socket event drives the refresh.
 */
export const HHA_SYNC_AFFECTED_QUERY_KEYS = [
  PATIENTS.fetchPatientsList.queryKey,
  PATIENTS.fetchPatientStats.queryKey,
  CAREGIVERS.fetchCaregiversList.queryKey,
  CAREGIVERS.fetchCaregiverAdminStats.queryKey,
  CASE_MANAGERS.fetchCaseManagersList.queryKey,
  CASE_MANAGERS.fetchCaseManagerAdminStats.queryKey,
  NURSES.fetchNursesList.queryKey,
  NURSES.fetchNurseAdminStats.queryKey,
  HHA_VISITS.fetchHhaVisitsList.queryKey,
  USERS.fetchOrgUsersList.queryKey,
  HHA_SYNC_HISTORY.fetchSyncRunsList.queryKey,
  HHA_SYNC_HISTORY.fetchSyncRun.queryKey,
  HHA_SYNC_HISTORY.fetchSyncChangesList.queryKey,
  HHA_SYNC_HISTORY.fetchSyncExceptionsList.queryKey,
  HHA_SYNC_HISTORY.fetchSyncExceptionCounts.queryKey,
  HHA_SYNC_HISTORY.fetchEmailConflictsList.queryKey,
  HHA_SYNC_HISTORY.fetchCoordinatorPatientsList.queryKey,
  HHA_SYNC_HISTORY.fetchWaitingPatientsList.queryKey,
];

/** Read once when a Sync control mounts, so a reload mid-run shows it busy. */
export const HHA_SYNC = {
  fetchHhaSyncStatus: {
    queryKey: 'getHhaSyncStatus',
    endpoint: API_ENDPOINTS.HHA_EXCHANGE.SYNC_STATUS(),
  },
};

export const SESSIONS = {
  fetchSessionsList: {
    queryKey: 'getSessionsList',
    endpoint: API_ENDPOINTS.SESSIONS.LIST(),
  },
};

export const ORGANIZATIONS = {
  fetchWorkingHours: {
    queryKey: 'getOrganizationWorkingHours',
    endpoint: API_ENDPOINTS.ORGANIZATIONS.GET_WORKING_HOURS(),
  },
  fetchTimeZone: {
    queryKey: 'getOrganizationTimeZone',
    endpoint: API_ENDPOINTS.ORGANIZATIONS.GET_TIME_ZONE(),
  },
  fetchEscalationPolicies: {
    queryKey: 'getOrganizationEscalationPolicies',
    endpoint: API_ENDPOINTS.ORGANIZATIONS.GET_ESCALATION_POLICIES(),
  },
};

export const SUPER_ADMIN = {
  fetchOrganizationsList: {
    queryKey: 'getSuperAdminOrganizationsList',
    endpoint: ({params}: {params: ManagedOrganizationsParams}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.SUPER_ADMIN.ORGANIZATIONS(),
        params,
      }),
  },
};

export const SECURITIES = {
  fetchOtpMethods: {
    queryKey: 'getOtpMethods',
    endpoint: API_ENDPOINTS.SECURITIES.GET_OTP_METHODS(),
  },
};

export const SEARCH = {
  fetchGlobalSearch: {
    queryKey: 'getGlobalSearch',
    endpoint: ({params}: {params: GlobalSearchParams}) =>
      buildDynamicURL({baseEndpoint: API_ENDPOINTS.SEARCH.GLOBAL(), params}),
  },
};

export const AUDIT_LOGS = {
  fetchAuditLogsList: {
    queryKey: 'getAuditLogsList',
    endpoint: ({params}: {params: any}) =>
      buildDynamicURL({
        baseEndpoint: API_ENDPOINTS.AUDIT_LOGS.LIST(),
        params,
      }),
    activeServerSidePagination: true,
  },
};
