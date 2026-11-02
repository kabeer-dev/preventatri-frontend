import {ReactNode} from 'react';

import {DashboardStatFormat} from '@/shared/interfaces/dashboard';
import {DateRange, DateRangeControlProps} from '@/shared/interfaces/inputs';
import {
  ListToolbarFilterField,
  ListToolbarFiltersProps,
} from '@/shared/interfaces/listToolbar';
import {CustomColorToken} from '@/shared/types/common';
import {
  ReportAlertStatus,
  ReportCoverageGapKey,
  ReportDeltaGoodWhen,
  ReportGrain,
  ReportKpiKey,
  ReportPatientTrend,
  ReportPeriodKpiKey,
  ReportRoleKey,
  ReportSubtitleParams,
  ReportTone,
  ReportVisitStatus,
} from '@/shared/types/reports';

export interface ReportPatientTrendConfig {
  labelKey: string;
  icon: string;
  bg: CustomColorToken;
  fg: CustomColorToken;
}

// Response shapes of the reports endpoints.

export interface ReportBucket {
  key: string;
  partial: boolean;
}

export interface ReportRange {
  from: string;
  to: string;
  grain: ReportGrain;
  timeZone: string;
  spanDays: number;
  buckets: ReportBucket[];
  previous: {from: string; to: string};
}

export interface ReportKpiValue {
  value: number | null;
  previous: number | null;
  delta: number | null;
}

export interface ReportKpiDetails {
  red: number;
  yellow: number;
  timeouts: number;
  p90ResolveSeconds: number | null;

  // Median time from the escalation starting to its assignee accepting it.
  medianAcceptSeconds: number | null;
  missed: number;
  late: number;
}

export interface ReportOverdueNow {
  total: number;
  tasks: number;
  visits: number;
}

export interface ReportRoleFigure {
  pct: number | null;
  part: number;
  total: number;
  people: number;
}

export interface ReportOverviewResponse {
  range: ReportRange;
  kpis: Record<ReportPeriodKpiKey, ReportKpiValue>;
  kpiDetails: ReportKpiDetails;
  overdueNow: ReportOverdueNow;
  alertStatus: Record<ReportAlertStatus, number>;
  roles: Record<ReportRoleKey, ReportRoleFigure>;
}

// A null regionId and regionName is the "Unassigned region" row.
export interface ReportRegionRow {
  regionId: string | null;
  regionName: string | null;
  activePatients: number;
  alerts: number;
  slaCompliancePct: number | null;
  medianResolveSeconds: number | null;
  medianAcceptSeconds: number | null;
  assessmentsOnTimePct: number | null;
  overdueNow: number;
}

export interface ReportRegionsResponse {
  range: ReportRange;
  regions: ReportRegionRow[];
}

export interface ReportCaseManagerName {
  firstName: string;
  lastName: string;
}

export interface ReportHighRiskPatient {
  patientId: string;
  firstName: string;
  lastName: string;
  countyName: string | null;
  caseManager: ReportCaseManagerName | null;
  redAlerts: number;
  yellowAlerts: number;
  trend: ReportPatientTrend | null;
  overdueFollowUps: number;
  riskRank: number;
}

export interface ReportHighRiskPatientsResponse {
  range: ReportRange;
  patients: ReportHighRiskPatient[];
}

export interface ReportFollowUpTrend {
  buckets: ReportBucket[];
  created: number[];
  completed: number[];
}

export interface ReportFollowUps {
  created: number;
  completed: number;
  completedOnTimePct: number | null;
  overdueNow: number;
  trend: ReportFollowUpTrend;
}

export interface ReportVisitStatusCount {
  status: ReportVisitStatus;
  count: number;
}

export interface ReportVisits {
  scheduled: number;
  filed: number;
  filedOnTimePct: number | null;
  medianReviewSeconds: number | null;
  overdueNow: number;
  statusMix: ReportVisitStatusCount[];
  concernsNoted: number;
  correctionRequested: number;
}

export interface ReportWorkItemsResponse {
  range: ReportRange;
  followUps: ReportFollowUps;
  visits: ReportVisits;
}

// A gap is null when it does not apply, e.g. "without a county" for a region.
export interface ReportCoverageResponse {
  asOf: string;
  gaps: Record<ReportCoverageGapKey, number | null>;
}

export interface ReportCoverageParams {
  regionId?: string;
}

export interface ReportScopeParams {
  regionId?: string;
  caregiverUserId?: string;
  caseManagerUserId?: string;
  nurseUserId?: string;
  patientId?: string;
}

export interface ReportApiParams extends ReportScopeParams {
  from: string;
  to: string;
}

export interface ReportAlertStatusConfig {
  key: ReportAlertStatus;
  labelKey: string;
  color: CustomColorToken;
}

export interface ReportThreshold {
  good: number;
  watch: number;
}

export interface ReportKpiTileConfig {
  key: ReportKpiKey;
  titleKey: string;
  subtitleKey: string;
  format: DashboardStatFormat;
  goodWhen?: ReportDeltaGoodWhen;
  isLive?: boolean;
  thresholds?: ReportThreshold;
}

export interface ReportKpiTileValues {
  value: number | null;
  delta: number | null;
  subtitleParams: ReportSubtitleParams;
}

export interface ReportDeltaLabel {
  labelKey: string;
  params: {arrow: string; amount: string};
}

export interface ReportRoleConfig {
  key: ReportRoleKey;
  labelKey: string;
  measureKey: string;
}

export interface ReportCoverageGapConfig {
  key: ReportCoverageGapKey;
  titleKey: string;
  reasonKey: string;
}

export interface ReportVisitStatusConfig {
  labelKey: string;
  color: string;
}

export interface ReportCardProps {
  title: string;
  caption?: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  children: ReactNode;
}

export interface ReportErrorStateProps {
  onRetry: () => void;
}

export interface ReportsToolbarProps {
  range: DateRange;
  updatedAt: number;
  onRangeChange: DateRangeControlProps['onRangeChange'];
  filters: ListToolbarFiltersProps;
}

export interface ReportSectionProps {
  params: ReportApiParams;
}

export interface CoverageGapsCardProps {
  params: ReportCoverageParams;
}

export interface ReportExportMenuProps {
  params: ReportApiParams;
  coverageParams: ReportCoverageParams;
  filterFields: ListToolbarFilterField[];
}

export interface ReportOverviewSectionProps {
  overview?: ReportOverviewResponse;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export interface MiniStatProps {
  value: ReactNode;
  label: string;
  tone?: ReportTone;
  isLive?: boolean;
}
