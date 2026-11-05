import {OrganizationActionEndpointParams} from '@/shared/interfaces/superAdmin';

export const API_ENDPOINTS = {
  USERS: {
    LOGIN: () => '/users/login',
    SIGNUP: () => '/users/signup',
    UPDATE_PROFILE: () => '/users/profile',
    REGENERATE_PRIVATE_OTP: () => '/users/otp/regenerate/private',
    REGENERATE_PUBLIC_OTP: () => '/users/otp/regenerate/public',
    RESEND_VERIFICATION: () => '/users/verify/refresh',
    RESEND_INVITATION: () => '/users/invitation/resend',
    BULK_INVITATION: () => '/users/invitation/bulk',
    REVOKE_INVITATION: () => '/users/invitation/revoke',
    VERIFY: ({token}: {token: string}) => `/users/verify/new/${token}`,
    SEND_RESET_PASSWORD: () => '/users/forgot-password',
    RESET_PASSWORD: ({token}: {token: string}) => `/users/reset/${token}`,
    VERIFY_INVITED_USER: ({token}: {token: string}) => `/users/verify/${token}`,
    LOGOUT: () => '/users/logout',
    SEND_UNLOCK_EMAIL: () => '/users/unlock-account/send',
    UNLOCK_ACCOUNT: ({token}: {token: string}) =>
      `/users/unlock-account/${token}`,
    GET_USERS_LIST: () => '/users/',

    // Every role is invited here; the backend picks the body schema and
    // controller from userType (routes/users/index.js).
    INVITE: ({userType}: {userType: string}) =>
      `/users/invite?userType=${userType}`,
    GET_LOGIN_USER: () => '/users/me',
    MY_ORGANIZATIONS: () => '/users/me/organizations',
    SWITCH_ORGANIZATION: () => '/users/switch-organization',
    ACCEPT_ORGANIZATION_INVITATION: ({token}: {token: string}) =>
      `/users/organization-invitations/${token}/accept`,
    UPDATE_USER_LANGUAGE: () => '/users/language',
    UPLOAD_PROFILE_IMAGE: () => '/users/profile-image',
    UPDATE_PROFILE_IMAGE: () => '/users/profile-image',
    DELETE_PROFILE_IMAGE: () => '/users/profile-image',
  },
  REGIONS: {
    LIST: () => '/regions',
    GET: ({id}: {id: string}) => `/regions/${id}`,
    CREATE: () => '/regions',
    UPDATE: ({id}: {id: string}) => `/regions/${id}`,
    DELETE: ({id}: {id: string}) => `/regions/${id}`,
  },
  NURSES: {
    LIST: () => '/nurses',
    DASHBOARD: () => '/nurses/dashboard',
    ADMIN_STATS: () => '/nurses/admin/stats',
    GET: ({id}: {id: string}) => `/nurses/${id}`,
    UPDATE: ({id}: {id: string}) => `/nurses/${id}`,
    DELETE: ({id}: {id: string}) => `/nurses/${id}`,
  },
  CAREGIVERS: {
    LIST: () => '/caregivers',
    STATS: () => '/caregivers/stats',
    ADMIN_STATS: () => '/caregivers/admin/stats',
    GET: ({id}: {id: string}) => `/caregivers/${id}`,
    STATISTICS: ({id}: {id: string}) => `/caregivers/${id}/statistics`,
    UPDATE: ({id}: {id: string}) => `/caregivers/${id}`,
    DELETE: ({id}: {id: string}) => `/caregivers/${id}`,
  },
  CASE_MANAGERS: {
    LIST: () => '/case-managers',
    DASHBOARD: () => '/case-managers/dashboard',
    ADMIN_STATS: () => '/case-managers/admin/stats',
    GET: ({id}: {id: string}) => `/case-managers/${id}`,
    UPDATE: ({id}: {id: string}) => `/case-managers/${id}`,
    DELETE: ({id}: {id: string}) => `/case-managers/${id}`,
    AVAILABLE_PATIENTS: () => '/case-managers/available-patients',
  },
  PATIENTS: {
    LIST: () => '/patients',
    STATS: () => '/patients/stats',
    GET: ({id}: {id: string}) => `/patients/${id}`,
    ASSESSMENTS: ({id}: {id: string}) => `/patients/${id}/assessments`,
    TIMELINE: ({id}: {id: string}) => `/patients/${id}/timeline`,
    CREATE: () => '/patients',
    UPDATE: ({id}: {id: string}) => `/patients/${id}`,
    DELETE: ({id}: {id: string}) => `/patients/${id}`,
  },
  HHA_EXCHANGE: {
    // One endpoint for the whole run: a sync reconciles every HHAeXchange
    // resource (patients and caregivers) under a single lock, so there is no
    // per-resource import to address. The path is provider-neutral — which
    // vendor backs the integration is a backend implementation detail.
    SYNC: () => '/integration/sync',

    // Read once on mount, not polled.
    SYNC_STATUS: () => '/integration/sync/status',

    // Read side of the visit import: the one HHAeXchange resource with no
    // PreventaTri entity of its own to list from.
    VISITS: () => '/integration/visits',
    VISIT: ({id}: {id: string}) => `/integration/visits/${id}`,

    // The HHA Sync page: run history, change history and the exceptions worklist.
    SYNC_RUNS: () => '/integration/sync/runs',
    SYNC_RUN: ({id}: {id: string}) => `/integration/sync/runs/${id}`,
    SYNC_CHANGES: () => '/integration/sync/changes',
    SYNC_EXCEPTIONS: () => '/integration/sync/exceptions',
    SYNC_EXCEPTION_COUNTS: () => '/integration/sync/exceptions/counts',
    SYNC_EXCEPTION: ({id}: {id: string}) =>
      `/integration/sync/exceptions/${id}`,
    SYNC_EXCEPTION_COUNTY: ({id}: {id: string}) =>
      `/integration/sync/exceptions/${id}/county`,
    SYNC_EXCEPTION_PATIENTS: ({id}: {id: string}) =>
      `/integration/sync/exceptions/${id}/patients`,

    // The two decisions only an admin can take: unique emails, case manager.
    SYNC_EMAIL_CONFLICTS: () => '/integration/sync/email-conflicts',
    SYNC_EMAIL_CONFLICT_USER: ({userId}: {userId: string}) =>
      `/integration/sync/email-conflicts/users/${userId}`,
    SYNC_EMAIL_CONFLICT_PENDING: ({id}: {id: string}) =>
      `/integration/sync/email-conflicts/pending/${id}`,
    SYNC_COORDINATORS: () => '/integration/sync/coordinators',
    PATIENT_CASE_MANAGER: ({patientId}: {patientId: string}) =>
      `/integration/patients/${patientId}/case-manager`,
    PATIENT_PRIMARY_NURSE: ({patientId}: {patientId: string}) =>
      `/integration/patients/${patientId}/primary-nurse`,
    PATIENT_CASE_MANAGER_CONFLICT: ({patientId}: {patientId: string}) =>
      `/integration/patients/${patientId}/case-manager-conflict`,
  },
  ASSESSMENTS: {
    LIST: () => '/assessments/templates',
    GET: ({id}: {id: string}) => `/assessments/templates/${id}`,
    CREATE: () => '/assessments/templates',
    UPDATE: ({id}: {id: string}) => `/assessments/templates/${id}`,
    STATUS: ({id}: {id: string}) => `/assessments/templates/${id}/status`,
    DELETE: ({id}: {id: string}) => `/assessments/templates/${id}`,
  },
  SUBMISSIONS: {
    LIST: () => '/assessments/submissions',
    GET: ({id}: {id: string}) => `/assessments/submissions/${id}`,
    CREATE: () => '/assessments/submissions',
    UPDATE: ({id}: {id: string}) => `/assessments/submissions/${id}`,
    VOID: ({id}: {id: string}) => `/assessments/submissions/${id}/void`,
    SKIP: ({id}: {id: string}) => `/assessments/submissions/${id}/skip`,
  },
  CHECKLIST_ASSIGNMENTS: {
    LIST: () => '/assessments/assignments',
    CREATE: () => '/assessments/assignments',
    DELETE: ({id}: {id: string}) => `/assessments/assignments/${id}`,
  },
  EMERGENCY_FLAGS: {
    GET: ({id}: {id: string}) => `/assessments/emergency-flags/${id}`,
    LIST: () => '/assessments/emergency-flags',
    CREATE: () => '/assessments/emergency-flags',
    VOID: ({id}: {id: string}) => `/assessments/emergency-flags/${id}/void`,
  },
  FLAGS: {
    LIST_ACTIVE: () => '/assessments/escalations/assigned',
    CASE_DETAILS: ({id}: {id: string}) =>
      `/assessments/escalations/submission/${id}`,
    RESOLVE: ({id}: {id: string}) => `/assessments/escalations/${id}/resolve`,
    ACCEPT: ({id}: {id: string}) => `/assessments/escalations/${id}/accept`,
  },
  COUNTIES: {
    LIST: () => '/counties',
    REFERENCE_LIST: () => '/counties/reference',
  },
  NOTIFICATIONS: {
    LIST: () => '/notifications',
    LIST_ALL: () => '/notifications/all',
    MARK_ALL_READ: () => '/notifications/read-all',
    MARK_AS_READ: ({id}: {id: string}) => `/notifications/${id}/read`,
  },
  SUPERVISORY_VISITS: {
    LIST: () => '/supervisory-visits',
    ASSIGNEES: () => '/supervisory-visits/assignees',
    CREATE: () => '/supervisory-visits',
    GET: ({id}: {id: string}) => `/supervisory-visits/${id}`,
    UPDATE: ({id}: {id: string}) => `/supervisory-visits/${id}`,
    CANCEL: ({id}: {id: string}) => `/supervisory-visits/${id}/cancel`,

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // REOPEN: ({id}: {id: string}) => `/supervisory-visits/${id}/reopen`,
    COMPLETE: ({id}: {id: string}) => `/supervisory-visits/${id}/complete`,
    APPROVE: ({id}: {id: string}) => `/supervisory-visits/${id}/approve`,
    REQUEST_CORRECTION: ({id}: {id: string}) =>
      `/supervisory-visits/${id}/request-correction`,
  },
  DASHBOARD: {
    ADMIN_STATS: () => '/users/admin/stats',
    ADMIN_STATS_TRENDS: () => '/users/admin/stats/trends',
  },
  TRIAGE_ENGINE: {
    STATS: () => '/triage-engine/stats',
    ALERTS: () => '/triage-engine/alerts',
  },
  FOLLOW_UP_TASKS: {
    LIST: () => '/follow-up-tasks',
    ASSIGNEES: () => '/follow-up-tasks/assignees',
    GET: ({id}: {id: string}) => `/follow-up-tasks/${id}`,
    CREATE: () => '/follow-up-tasks',
    UPDATE: ({id}: {id: string}) => `/follow-up-tasks/${id}`,
    CANCEL: ({id}: {id: string}) => `/follow-up-tasks/${id}/cancel`,

    // PREVENT-772: reopen removed for now; uncomment to restore.
    // REOPEN: ({id}: {id: string}) => `/follow-up-tasks/${id}/reopen`,
    SUBMIT: ({id}: {id: string}) => `/follow-up-tasks/${id}/submit`,
    COMPLETE: ({id}: {id: string}) => `/follow-up-tasks/${id}/complete`,
  },
  ORGANIZATIONS: {
    GET_WORKING_HOURS: () => '/organizations/working-hours',
    UPDATE_WORKING_HOURS: () => '/organizations/working-hours',
    GET_TIME_ZONE: () => '/organizations/time-zone',
    UPDATE_TIME_ZONE: () => '/organizations/time-zone',
    GET_ESCALATION_POLICIES: () => '/organizations/escalation-policies',
    UPDATE_ESCALATION_POLICY: ({flag}: {flag: string}) =>
      `/organizations/escalation-policies/${flag}`,
    GET_HHA_CREDENTIALS: () => '/organizations/hha-credentials',
    SAVE_HHA_CREDENTIALS: () => '/organizations/hha-credentials',
    DISCONNECT_HHA_CREDENTIALS: () => '/organizations/hha-credentials',
  },
  SUPER_ADMIN: {
    ORGANIZATIONS: () => '/super-admin/organizations',
    ORGANIZATION_ACTION: ({id, action}: OrganizationActionEndpointParams) =>
      `/super-admin/organizations/${id}/${action}`,
  },
  SESSIONS: {
    LIST: () => '/sessions',
    SIGN_OUT_OTHER_DEVICES: () => '/sessions/signout-other-devices',
    REVOKE: ({sessionId}: {sessionId: string}) =>
      `/sessions/signout/${sessionId}`,
  },
  SECURITIES: {
    GET_OTP_METHODS: () => '/securities/otp-methods',
    UPDATE_OTP_METHODS: ({id}: {id: string}) => `/securities/otp-methods/${id}`,
  },
  SEARCH: {
    GLOBAL: () => '/search',
  },
  AUDIT_LOGS: {
    LIST: () => '/audit-logs',
    EXPORTS: () => '/audit-logs/exports',
  },
  REPORTS: {
    OVERVIEW: () => '/reports/overview',
    REGIONS: () => '/reports/regions',
    HIGH_RISK_PATIENTS: () => '/reports/high-risk-patients',
    WORK_ITEMS: () => '/reports/work-items',
    COVERAGE: () => '/reports/coverage',
  },
};
