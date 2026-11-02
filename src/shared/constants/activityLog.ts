import {controlHeight} from '@/@core/theme/spacing';
import {DASHBOARD_EXPORT_FORMATS} from '@/shared/constants/dashboard';

// The two views of the activity log page: the audit trail of user actions and
// the system logs of every notification the system sent.
export const ACTIVITY_LOG_VIEW = {
  audit: 'audit',
  system: 'system',
} as const;

// URL key the selected view is kept under.
export const ACTIVITY_LOG_VIEW_PARAM = 'view';

// Mirrors the backend's AUDIT_OPERATIONS enum -- the audit log's `action` is
// always one of these values, so both the action-type filter and the color
// map below are keyed off it directly.
export const AUDIT_OPERATIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  RESET_PASSWORD: 'RESET_PASSWORD',
  INVITE: 'INVITE',
  ACCOUNT_LOCK: 'ACCOUNT_LOCK',
  ACCOUNT_UNLOCK: 'ACCOUNT_UNLOCK',
  SYNC_STARTED: 'SYNC_STARTED',
  SYNC_COMPLETED: 'SYNC_COMPLETED',
  SYNC_FAILED: 'SYNC_FAILED',
  INVITE_RESENT: 'INVITE_RESENT',
  INVITE_ACCEPTED: 'INVITE_ACCEPTED',
  INVITE_REVOKED: 'INVITE_REVOKED',
  ESCALATION_STARTED: 'ESCALATION_STARTED',
  ESCALATION_ASSIGNED: 'ESCALATION_ASSIGNED',
  ESCALATED: 'ESCALATED',

  // The escalation assignee accepted a flag, stopping its escalation.
  ESCALATION_ACCEPTED: 'ESCALATION_ACCEPTED',

  // SMS / email outcome of an alert notification, logged by the system.
  NOTIFICATION_DELIVERY: 'NOTIFICATION_DELIVERY',
} as const;

// One chip colour for the whole invitation lifecycle.
const AUDIT_LOG_INVITE_COLOR = {
  bg: 'customColors.auditActionInviteBg',
  fg: 'customColors.auditActionInviteFg',
};

// Keyed by the lowercased action (see getAuditLogActionColor), matching how
// getAuditLogActionLabel resolves activityLog.actions.* translations.
//
// Each action gets its own customColors bg/fg pair (defined in
// @core/theme/palette) rather than reusing the 6 MUI theme colors, since
// there are 13 actions and only 6 theme colors to go around -- reusing them
// made unrelated actions (e.g. update/read, create/invite) render as the
// same color chip.
export const AUDIT_LOG_ACTION_COLORS: Record<string, {bg: string; fg: string}> =
  {
    create: {
      bg: 'customColors.auditActionCreateBg',
      fg: 'customColors.auditActionCreateFg',
    },
    read: {
      bg: 'customColors.auditActionReadBg',
      fg: 'customColors.auditActionReadFg',
    },
    update: {
      bg: 'customColors.auditActionUpdateBg',
      fg: 'customColors.auditActionUpdateFg',
    },
    delete: {
      bg: 'customColors.auditActionDeleteBg',
      fg: 'customColors.auditActionDeleteFg',
    },
    login: {
      bg: 'customColors.auditActionLoginBg',
      fg: 'customColors.auditActionLoginFg',
    },
    logout: {
      bg: 'customColors.auditActionLogoutBg',
      fg: 'customColors.auditActionLogoutFg',
    },
    reset_password: {
      bg: 'customColors.auditActionResetPasswordBg',
      fg: 'customColors.auditActionResetPasswordFg',
    },
    invite: AUDIT_LOG_INVITE_COLOR,
    invite_resent: AUDIT_LOG_INVITE_COLOR,
    invite_accepted: AUDIT_LOG_INVITE_COLOR,
    invite_revoked: AUDIT_LOG_INVITE_COLOR,
    account_lock: {
      bg: 'customColors.auditActionAccountLockBg',
      fg: 'customColors.auditActionAccountLockFg',
    },
    escalation_started: {
      bg: 'customColors.auditActionCreateBg',
      fg: 'customColors.auditActionCreateFg',
    },
    escalation_assigned: AUDIT_LOG_INVITE_COLOR,
    escalated: {
      bg: 'customColors.auditActionAccountLockBg',
      fg: 'customColors.auditActionAccountLockFg',
    },
    account_unlock: {
      bg: 'customColors.auditActionAccountUnlockBg',
      fg: 'customColors.auditActionAccountUnlockFg',
    },
    sync_started: {
      bg: 'customColors.auditActionSyncStartedBg',
      fg: 'customColors.auditActionSyncStartedFg',
    },
    sync_completed: {
      bg: 'customColors.auditActionSyncCompletedBg',
      fg: 'customColors.auditActionSyncCompletedFg',
    },
    sync_failed: {
      bg: 'customColors.auditActionSyncFailedBg',
      fg: 'customColors.auditActionSyncFailedFg',
    },

    escalation_accepted: {
      bg: 'customColors.auditActionEscalationAcceptedBg',
      fg: 'customColors.auditActionEscalationAcceptedFg',
    },
    notification_delivery: {
      bg: 'customColors.auditActionSyncStartedBg',
      fg: 'customColors.auditActionSyncStartedFg',
    },
  };

// Fallback for an action the map above doesn't recognize.
export const AUDIT_LOG_DEFAULT_ACTION_COLOR = {
  bg: 'customColors.auditActionLogoutBg',
  fg: 'customColors.auditActionLogoutFg',
};

// The action-type filter's options, translated via activityLog.actions.*
// (lowercased, same convention getAuditLogActionLabel uses). Sync runs are not
// audited, so they aren't offered as a filter.
const UNAUDITED_ACTION_TYPES: string[] = [
  AUDIT_OPERATIONS.SYNC_STARTED,
  AUDIT_OPERATIONS.SYNC_COMPLETED,
  AUDIT_OPERATIONS.SYNC_FAILED,
];

export const ACTIVITY_LOG_ACTION_TYPES = Object.values(AUDIT_OPERATIONS).filter(
  (action) => !UNAUDITED_ACTION_TYPES.includes(action)
);

// Mirrors the backend's per-route resourceType map -- the audit log's
// `resourceType` is always one of these values.
export const ACTIVITY_LOG_RESOURCE_TYPES = [
  'user',
  'nurse',
  'caregiver',
  'patient',
  'caseManager',
  'region',
  'county',
  'checklistTemplate',
  'checklistSubmission',
  'checklistAssignment',
  'emergencyFlag',
  'assignedEscalation',
  'escalationPolicy',
  'workingHours',
  'timeZone',
  'otpMethod',
  'SignoutADevice',
  'SignoutAllOtherDevices',
  'patientAssessments',
  'caregiverStatistics',
  'supervisoryVisit',
  'followUpTask',
];

export const ACTIVITY_LOG_DATE_RANGE_CONTROL = {
  panelWidth: 360,
  triggerIcon: 'mdi:calendar-outline',
  triggerHeight: controlHeight.md,
  triggerIconSize: 15,
  chevronSize: 12,
} as const;

// Each preset is a fixed trailing-day window (0 = today only).
export const ACTIVITY_LOG_DATE_RANGE_PRESETS = [
  {days: 0, labelKey: 'activityLog.dateRange.presets.today'},
  {days: 7, labelKey: 'activityLog.dateRange.presets.last7Days'},
  {days: 30, labelKey: 'activityLog.dateRange.presets.last30Days'},
  {days: 90, labelKey: 'activityLog.dateRange.presets.last90Days'},
] as const;

// --- Activity log export (PDF / CSV download) -----------------------------

export const ACTIVITY_LOG_EXPORT = {
  buttonIcon: 'mdi:download-outline',
  dialogWidth: 460,

  // Rows per page when paging through the list endpoint to collect every log
  // in the selected range (the export isn't limited to what's on screen).
  pageSize: 100,

  fileName: 'activity-log-export',

  // The export is capped at a 7-day window (inclusive of both endpoints) to
  // keep the report generation fast and the file size manageable.
  maxRangeDays: 7,
} as const;

// Options for the export dialog's format radio group, in display order.
export const ACTIVITY_LOG_EXPORT_FORMAT_OPTIONS = [
  {
    value: DASHBOARD_EXPORT_FORMATS.PDF,
    labelKey: 'activityLog.export.formats.pdf',
  },
  {
    value: DASHBOARD_EXPORT_FORMATS.CSV,
    labelKey: 'activityLog.export.formats.csv',
  },
];
