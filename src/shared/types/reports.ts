export type ReportTone = 'good' | 'watch' | 'poor' | 'neutral';

export type ReportPatientTrend = 'WORSENING' | 'IMPROVING' | 'STABLE';

export type ReportGrain = 'day' | 'week' | 'month';

export type ReportRoleKey = 'nurses' | 'caseManagers' | 'caregivers' | 'admins';

export type ReportAlertStatus = 'open' | 'accepted' | 'resolved' | 'voided';

export type ReportPeriodKpiKey =
  | 'alertsRaised'
  | 'slaCompliancePct'
  | 'medianResolveSeconds'
  | 'assessmentsOnTimePct';

export type ReportKpiKey = ReportPeriodKpiKey | 'overdueWork';

export type ReportDeltaGoodWhen = 'up' | 'down';

export type ReportThresholdKey = 'sla' | 'role';

export type ReportSubtitleParams = Record<string, number | string>;

export type ReportVisitStatus =
  'SCHEDULED' | 'UNDER_REVIEW' | 'APPROVED' | 'OVERDUE' | 'CANCELLED';

export type ReportCoverageGapKey =
  | 'patientsWithoutCounty'
  | 'patientsWithoutPrimaryNurse'
  | 'patientsWithoutCaseManager'
  | 'patientsWithoutActiveChecklist'
  | 'regionsWithoutPrimaryDefault'
  | 'nursesLicenseExpiring';
