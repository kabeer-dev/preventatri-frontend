import {GridColDef} from '@mui/x-data-grid';

import {
  STATISTICS_DEFAULT_RANGE_DAYS,
  STATISTICS_RANGE_PRESET_OPTIONS,
} from '@/shared/constants/dashboard';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {DateRangePresetOption} from '@/shared/interfaces/inputs';
import {
  ReportAlertStatusConfig,
  ReportCoverageGapConfig,
  ReportKpiTileConfig,
  ReportPatientTrendConfig,
  ReportRoleConfig,
  ReportThreshold,
  ReportVisitStatusConfig,
} from '@/shared/interfaces/reports';
import {
  ReportPatientTrend,
  ReportThresholdKey,
  ReportTone,
  ReportVisitStatus,
} from '@/shared/types/reports';

// Colour thresholds for percentages.
export const REPORT_THRESHOLDS: Record<ReportThresholdKey, ReportThreshold> = {
  sla: {good: 95, watch: 85},
  role: {good: 90, watch: 80},
};

// Same trailing window as the date button's default, so its preset shows as
// applied on first load.
export const REPORT_DEFAULT_RANGE_DAYS = STATISTICS_DEFAULT_RANGE_DAYS;

// Longest period, as days from start to end, so "Last 90 days" fits exactly.
export const REPORT_MAX_RANGE_DAYS = 90;

export const REPORT_RANGE_PRESETS: DateRangePresetOption[] = [
  ...STATISTICS_RANGE_PRESET_OPTIONS,
  {
    value: String(REPORT_MAX_RANGE_DAYS),
    labelKey: 'reports.presets.last90Days',
  },
];

export const REPORT_KPI_TILES: ReportKpiTileConfig[] = [
  {
    key: 'alertsRaised',
    titleKey: 'reports.kpis.alertsRaised',
    subtitleKey: 'reports.kpis.alertsRaisedSub',
    format: 'number',
    goodWhen: 'down',
  },
  {
    key: 'slaCompliancePct',
    titleKey: 'reports.kpis.sla',
    subtitleKey: 'reports.kpis.slaSub',
    format: 'percent',
    goodWhen: 'up',
    thresholds: REPORT_THRESHOLDS.sla,
  },
  {
    key: 'medianResolveSeconds',
    titleKey: 'reports.kpis.medianResolve',
    subtitleKey: 'reports.kpis.medianResolveSub',
    format: 'duration',
    goodWhen: 'down',
  },
  {
    key: 'assessmentsOnTimePct',
    titleKey: 'reports.kpis.assessments',
    subtitleKey: 'reports.kpis.assessmentsSub',
    format: 'percent',
    goodWhen: 'up',
    thresholds: REPORT_THRESHOLDS.role,
  },
  {
    key: 'overdueWork',
    titleKey: 'reports.kpis.overdueWork',
    subtitleKey: 'reports.kpis.overdueWorkSub',
    format: 'number',
    isLive: true,
  },
];

export const REPORT_ROLES: ReportRoleConfig[] = [
  {
    key: 'nurses',
    labelKey: 'reports.roles.nurses',
    measureKey: 'reports.roles.nursesMeasure',
  },
  {
    key: 'caseManagers',
    labelKey: 'reports.roles.caseManagers',
    measureKey: 'reports.roles.caseManagersMeasure',
  },
  {
    key: 'caregivers',
    labelKey: 'reports.roles.caregivers',
    measureKey: 'reports.roles.caregiversMeasure',
  },
  {
    key: 'admins',
    labelKey: 'reports.roles.admins',
    measureKey: 'reports.roles.adminsMeasure',
  },
];

// URL and API names. People are User ids; FILTER_PARAMS.caseManager is the
// task lists' profile id, so it is not reused here.
export const REPORT_PERSON_FILTER_PARAMS = {
  caregiver: 'caregiverUserId',
  caseManager: 'caseManagerUserId',
  nurse: 'nurseUserId',
  patient: FILTER_PARAMS.patient,
} as const;

export const REPORT_ALERT_STATUSES: ReportAlertStatusConfig[] = [
  {
    key: 'open',
    labelKey: 'reports.alertStatus.open',
    color: 'severityModerateBar',
  },
  {
    key: 'accepted',
    labelKey: 'reports.alertStatus.accepted',
    color: 'alertAcceptedBar',
  },
  {
    key: 'resolved',
    labelKey: 'reports.alertStatus.resolved',
    color: 'severityStableBar',
  },
  {key: 'voided', labelKey: 'reports.alertStatus.voided', color: 'inkFaint'},
];

export const REPORT_ALERT_STATUS_CHART = {
  size: 140,
  cutout: '68%',
} as const;

// Performance colours, not clinical severity.
export const REPORT_TONE_COLORS: Record<ReportTone, string> = {
  good: 'success.main',
  watch: 'warning.main',
  poor: 'error.main',
  neutral: 'text.primary',
};

export const REPORT_DELTA = {
  upArrow: '↑',
  downArrow: '↓',
  labelKey: 'reports.kpis.delta',
  pointsLabelKey: 'reports.kpis.deltaPoints',
  neutralColor: 'text.secondary',
} as const;

export const REPORT_TOOLBAR = {
  updatedFormat: 'd LLL, HH:mm',
} as const;

export const REPORT_CARD = {
  skeletonHeight: 120,
} as const;

export const REPORT_ROLE_ROW = {
  barWidth: 120,
  percentWidth: 56,
  barHeight: 6,
} as const;

// The scorecard never paginates; the community DataGrid caps a page at 100.
export const REPORT_SCORECARD_PAGE_SIZE = 100;

export const REPORT_SCORECARD_NUMERIC_COLUMN: Partial<GridColDef> = {
  flex: 0.1,
  minWidth: 120,
  sortable: false,
  align: 'right',
  headerAlign: 'right',
};

export const REPORT_UNASSIGNED_REGION_ROW_ID = 'unassigned';

export const REPORT_UNASSIGNED_REGION_KEY = 'reports.regions.unassigned';

// The backend returns at most this many rows (spec D7), so one page fits all.
export const REPORT_PATIENTS_PAGE_SIZE = 10;

export const REPORT_PATIENT_TRENDS: Record<
  ReportPatientTrend,
  ReportPatientTrendConfig
> = {
  WORSENING: {
    labelKey: 'reports.patients.trend.worsening',
    icon: 'mdi:trending-up',
    bg: 'severityModerateBg',
    fg: 'severityModerateFg',
  },
  IMPROVING: {
    labelKey: 'reports.patients.trend.improving',
    icon: 'mdi:trending-down',
    bg: 'severityStableBg',
    fg: 'severityStableFg',
  },
  STABLE: {
    labelKey: 'reports.patients.trend.stable',
    icon: 'mdi:trending-neutral',
    bg: 'segmentTrack',
    fg: 'inkSoft',
  },
};

export const REPORT_FOLLOW_UP_CHART = {
  bucketLabelFormat: 'd LLL',
} as const;

export const REPORT_SEGMENTED_BAR = {
  height: 12,
  topGap: 10,
} as const;

export const REPORT_VISIT_STATUS_MIX: Record<
  ReportVisitStatus,
  ReportVisitStatusConfig
> = {
  SCHEDULED: {
    labelKey: 'reports.visits.status.scheduled',
    color: 'customColors.brandMuted',
  },
  UNDER_REVIEW: {
    labelKey: 'reports.visits.status.underReview',
    color: 'customColors.severityModerateBar',
  },
  APPROVED: {
    labelKey: 'reports.visits.status.approved',
    color: 'customColors.severityStableBar',
  },
  OVERDUE: {
    labelKey: 'reports.visits.status.overdue',
    color: 'customColors.severityCriticalBar',
  },
  CANCELLED: {
    labelKey: 'reports.visits.status.cancelled',
    color: 'customColors.inkFaint',
  },
};

export const REPORT_COVERAGE_GAPS: ReportCoverageGapConfig[] = [
  {
    key: 'patientsWithoutCounty',
    titleKey: 'reports.coverage.withoutCounty',
    reasonKey: 'reports.coverage.withoutCountyWhy',
  },
  {
    key: 'patientsWithoutPrimaryNurse',
    titleKey: 'reports.coverage.withoutPrimaryNurse',
    reasonKey: 'reports.coverage.withoutPrimaryNurseWhy',
  },
  {
    key: 'patientsWithoutCaseManager',
    titleKey: 'reports.coverage.withoutCaseManager',
    reasonKey: 'reports.coverage.withoutCaseManagerWhy',
  },
  {
    key: 'patientsWithoutActiveChecklist',
    titleKey: 'reports.coverage.withoutChecklist',
    reasonKey: 'reports.coverage.withoutChecklistWhy',
  },
  {
    key: 'regionsWithoutPrimaryDefault',
    titleKey: 'reports.coverage.regionsWithoutPrimary',
    reasonKey: 'reports.coverage.regionsWithoutPrimaryWhy',
  },
  {
    key: 'nursesLicenseExpiring',
    titleKey: 'reports.coverage.licenses',
    reasonKey: 'reports.coverage.licensesWhy',
  },
];

export const REPORT_COVERAGE_TILE = {
  countFontSize: 28,
  countMinWidth: 40,
} as const;

export const REPORT_EXPORT = {
  buttonIcon: 'mdi:download-outline',
  pageFileName: 'reports',

  // Cache reads only: the sections own these queries with the same params,
  // so exporting never sends a request.
  cacheOnly: {enabled: false},

  personCountKeys: {
    [REPORT_PERSON_FILTER_PARAMS.caregiver]: 'reports.export.people.caregiver',
    [REPORT_PERSON_FILTER_PARAMS.caseManager]:
      'reports.export.people.caseManager',
    [REPORT_PERSON_FILTER_PARAMS.nurse]: 'reports.export.people.nurse',
    [REPORT_PERSON_FILTER_PARAMS.patient]: 'reports.export.people.patient',
  } as Record<string, string>,
} as const;
