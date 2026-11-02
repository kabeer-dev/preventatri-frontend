import {ComponentType, ReactNode} from 'react';

import type {jsPDF} from 'jspdf';

import {ThemeColor} from '@/@core/theme/types';
import {IconProps} from '@/shared/interfaces/common';
import {DateRange} from '@/shared/interfaces/inputs';
import {ReportScopeParams} from '@/shared/interfaces/reports';
import {SeverityColorKey} from '@/shared/types/dashboard';
import {StatsCardSeverity} from '@/shared/types/severity';

export interface AdminDashboardStats {
  openRedFlags: number;
  slaAtRisk: number;
  pendingAssessments: number;
  activePatients: number;
}

export interface AdminDashboardStatsResponse {
  stats: AdminDashboardStats;
}

// How a stat card renders its value. Backing runtime values live in
// DASHBOARD_STAT_FORMATS (constants/dashboard.ts). Omitted = zero-padded integer.
export type DashboardStatFormat = 'percent' | 'duration' | 'number';

// Shared config shape for a single stat card on any role dashboard. TStatKey is
// narrowed per role to its own stats interface (e.g. keyof NurseDashboardStats).
export interface DashboardStatConfig<TStatKey extends string = string> {
  statKey: TStatKey;
  icon?: ComponentType<IconProps>;
  severity?: StatsCardSeverity;
  color: ThemeColor;
  titleKey: string;
  subtitleKey?: string;

  // The subtitle interpolates `subtitleParams`, so it is hidden until they load.
  hasSubtitleParams?: boolean;
  format?: DashboardStatFormat;
  tinted?: boolean;

  // Drill-down target for the card's drill link (e.g. the alerts page).
  href?: string;

  drillLabelKey?: string;
}

// Responsive column span for a stat card, passed to MUI Grid's `size` prop. Each
// breakpoint is optional so roles can span by lg (admin/case manager) or md (nurse/caregiver).
export interface DashboardStatsGridSize {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// Props for the shared stat-card grid rendered on every role dashboard. Maps a
// role's stat config + grid size against its fetched stat values. TStatKey is
// inferred from `items` so `values` is type-checked against the same role stats.
export interface DashboardStatsGridProps<TStatKey extends string = string> {
  items: DashboardStatConfig<TStatKey>[];
  size: DashboardStatsGridSize;
  values?: Partial<Record<TStatKey, number | null>>;

  // Interpolation values for a card's subtitle, e.g. {red: 2, yellow: 5}.
  subtitleParams?: Partial<Record<TStatKey, Record<string, number>>>;
  isLoading?: boolean;
}

export interface DashboardStatSubtitleArgs {
  subtitleKey?: string;
  hasSubtitleParams?: boolean;
  params?: Record<string, number>;
}

// --- Admin dashboard Trends ---------------------------------------------------

// Flags raised per day by color, index-aligned with the trends labels.
export interface AdminDashboardFlagsRaisedSeries {
  red: number[];
  yellow: number[];
  green: number[];
}

// `pct` covers the whole window; `daily` is null on days with no resolutions.
export interface AdminDashboardSlaCompliance {
  pct: number | null;
  daily: (number | null)[];
}

export interface AdminDashboardTrends {
  labels: string[];
  flagsRaised: AdminDashboardFlagsRaisedSeries;
  slaCompliance: AdminDashboardSlaCompliance;
  range: {from: string | null; to: string | null};
}

export interface AdminDashboardTrendsResponse {
  trends: AdminDashboardTrends;
}

export type AdminDashboardActionStatKey = keyof AdminDashboardStats;

// `enabled` gates the admin stats request so non-admin roles never fire it.
export interface UseAdminDashboardDataParams {
  enabled?: boolean;
}

export interface UseAdminDashboardDataResult {
  statsUpdatedAt: number;
  actionValues: Partial<Record<AdminDashboardActionStatKey, number | null>>;
  isLoading: boolean;
}

export type StatisticsRangeParams = DateRange;

// The trends request narrows by region and person filters when set.
export interface AdminStatsTrendsParams
  extends StatisticsRangeParams, ReportScopeParams {}

// --- Admin dashboard trend charts (PREVENT-581) -------------------------------

export interface FlagsRaisedTierConfig {
  level: number;
  seriesKey: keyof AdminDashboardFlagsRaisedSeries;
  labelKey: string;
  colorKey: SeverityColorKey;
}

export interface TrendChartRangeProps {
  range: StatisticsRangeParams;
  filters?: ReportScopeParams;
}

export interface TrendCardProps {
  header: ReactNode;
  footer: ReactNode;
  isLoading: boolean;
  statusMessage?: string | null;
  children: ReactNode;
}

// --- Dashboard data export (PDF / CSV download) --------------------------------

// How an export serializes. Backing runtime values live in
// DASHBOARD_EXPORT_FORMATS (constants/dashboard.ts).
export type DashboardExportFormat = 'pdf' | 'csv';

// One titled table of already-translated cells — the unit both serializers
// (CSV and PDF) consume. Key-value stat sections render as two-column
// [metric, value] tables; the statistics time-series renders as a wide table.
export interface DashboardExportTable {
  title: string;
  head: string[];
  body: string[][];
}

// Args shared by the CSV/PDF serializers: the document title (PDF heading),
// the extension-less file name, and the tables to render.
export interface DashboardExportArgs {
  title: string;
  subtitle?: string;
  fileName: string;
  tables: DashboardExportTable[];
}

export interface DashboardExportDataArgs extends DashboardExportArgs {
  format: DashboardExportFormat;
}

// jsPDF augmented with jspdf-autotable's cursor (where the last table ended),
// used to stack one section table below the previous one.
export interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: {finalY: number};
}

export interface UseAlertQueueParams {
  enabled?: boolean;
}
