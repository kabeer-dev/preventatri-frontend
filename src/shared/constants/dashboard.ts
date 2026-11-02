import {brandColors, neutralColors} from '@/@core/theme/palette';
import {controlHeight} from '@/@core/theme/spacing';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import {
  DashboardExportFormat,
  DashboardStatFormat,
} from '@/shared/interfaces/dashboard';
import {SeverityTile} from '@/shared/interfaces/severity';
import {StatsCardSeverity} from '@/shared/types/severity';

// Shared across every role dashboard's stat-card grid (admin, nurse, caregiver,
// case manager). Kept role-agnostic so a single value governs all of them.
export const DASHBOARD_STATS_ICON_SIZE = 18;

export const STATS_CARD = {
  minHeight: 152,
  compactMinHeight: 132,
  metricGap: 4,
  compactMetricGap: 2.5,
  padding: 4.5,
  iconTileSize: 34,
  glyphSize: 15,
} as const;

export const STATS_CARD_SEVERITY_TILES: Record<
  StatsCardSeverity,
  SeverityTile
> = {
  critical: {
    glyph: SEVERITY_LEVELS.critical.glyph,
    bg: 'severityCriticalBg',
    fg: 'severityCriticalFg',
  },
  moderate: {
    glyph: SEVERITY_LEVELS.moderate.glyph,
    bg: 'severityModerateBg',
    fg: 'severityModerateFg',
  },
  stable: {
    glyph: SEVERITY_LEVELS.stable.glyph,
    bg: 'severityStableBg',
    fg: 'severityStableFg',
  },
  atRisk: {
    glyph: 'mdi:rhombus',
    bg: 'severityModerateBg',
    fg: 'severityModerateFg',
  },
  monitored: {
    glyph: 'mdi:rhombus-outline',
    bg: 'brandTint',
    fg: 'brandMuted',
  },
};

// How a stat card renders its numeric value. `percent` appends a % sign,
// `duration` formats seconds as a compact MM:SS/HH:MM:SS countdown, and the
// absence of a format (the default) zero-pads the integer as before.
export const DASHBOARD_STAT_FORMATS: Record<
  'PERCENT' | 'DURATION' | 'NUMBER',
  DashboardStatFormat
> = {
  PERCENT: 'percent',
  DURATION: 'duration',
  NUMBER: 'number',
};

// Suffix appended to a `percent`-formatted stat value.
export const DASHBOARD_STAT_PERCENT_SUFFIX = '%';

// Shown in place of a stat value when the underlying metric is null (its
// population was empty, e.g. no resolved cases in the window).
export const DASHBOARD_STAT_EMPTY_PLACEHOLDER = 'N/A';

// Spacing between stat cards in the shared dashboard stat-card grid (MUI Grid
// `spacing` units). Role-agnostic so every dashboard's grid stays aligned.
export const DASHBOARD_STATS_GRID_SPACING = 3.5;

// --- Admin dashboard statistics graph ---------------------------------------

// Default trailing window (days) for the statistics graph. Matches the backend
// default so the initial render doesn't trigger a second fetch.
export const STATISTICS_DEFAULT_RANGE_DAYS = 30;

// Luxon format for the x-axis date ticks: day and abbreviated month only, no
// year (e.g. "08 Jun").
export const STATISTICS_AXIS_DATE_FORMAT = 'dd MMM';

export const DATE_RANGE_CONTROL = {
  panelWidth: 404,
  triggerIcon: 'mdi:calendar-outline',
  triggerHeight: controlHeight.md,
  triggerIconSize: 15,
  chevronSize: 12,
} as const;

// Filter preset values. Each is a fixed trailing-day window.
export const STATISTICS_RANGE_PRESET_VALUES = {
  last7Days: '7',
  last30Days: '30',
};

export const STATISTICS_RANGE_PRESET_OPTIONS = [
  {
    value: STATISTICS_RANGE_PRESET_VALUES.last7Days,
    labelKey: 'dashboard.adminDashboard.statistics.presets.last7Days',
  },
  {
    value: STATISTICS_RANGE_PRESET_VALUES.last30Days,
    labelKey: 'dashboard.adminDashboard.statistics.presets.last30Days',
  },
];

// --- Admin dashboard trend charts (PREVENT-581) -------------------------------

export const TREND_CHART = {
  height: 150,
  flagsRaisedPadding: {top: 8, bottom: 8},
  slaCompliancePadding: {top: 20, bottom: 0},
  minPixelRatio: 2,
  barSegmentGap: 2,
  barRadius: 3,
  barCategoryPercentage: 0.9,
  lineWidth: 2,
  legendSwatchSize: 8,
  tooltipPadding: 12,
  tooltipBoxPadding: 6,
};

export const TREND_RANGE_LABEL_FORMAT = {
  sameYearStart: 'd MMM',
  full: 'd MMM yyyy',
};

// --- Dashboard data export (PDF / CSV download) --------------------------------

// Backing runtime values for DashboardExportFormat.
export const DASHBOARD_EXPORT_FORMATS: Record<
  'PDF' | 'CSV',
  DashboardExportFormat
> = {
  PDF: 'pdf',
  CSV: 'csv',
};

export const DASHBOARD_EXPORT = {
  fileNameDateFormat: 'yyyy-LL-dd',
  fileNameSeparator: '-',

  csv: {
    extension: 'csv',
    mimeType: 'text/csv;charset=utf-8',

    // Excel needs the BOM to read the file as UTF-8.
    bom: '\uFEFF',
    delimiter: ',',
    quote: '"',
    escapedQuote: '""',
    newline: '\n',
    lineBreak: '\r\n',
    formulaTriggerChars: ['=', '+', '-', '@', '\t', '\r'],
    formulaEscapePrefix: "'",
  },

  pdf: {
    extension: 'pdf',
    unit: 'pt',
    format: 'a4',
    margin: 40,
    titleFontSize: 16,
    sectionTitleFontSize: 12,
    tableFontSize: 9,

    // Vertical rhythm: gap below the document title, between a section heading
    // and its table, and between a table and the next section heading.
    titleGap: 28,
    sectionTitleGap: 8,
    sectionGap: 28,

    font: 'helvetica',
    titleLineHeight: 20,
    subtitleFontSize: 9,
    subtitleGap: 6,
    bandPaddingY: 26,
    footerFontSize: 8,
    footerOffset: 20,

    // Room a heading needs below it, so it never sits alone at a page end.
    minSectionSpace: 90,
    tableLineWidth: 0.5,

    // The file is always light, whatever the app theme is.
    colors: {
      band: brandColors.brand,
      bandText: neutralColors.surface,
      bandSubtext: brandColors.brandEdge,
      sectionTitle: brandColors.brand,
      headFill: brandColors.brand,
      headText: neutralColors.surface,
      rowAlt: neutralColors.surfaceRaised,
      text: neutralColors.ink,
      muted: neutralColors.inkSubtle,
      line: neutralColors.border,
    },
  },
} as const;

export const ALERT_QUEUE = {
  previewLimit: 4,
  rowPaddingX: 4.5,
  rowPaddingY: 3,
} as const;

export const RECENT_ACTIVITY = {
  previewLimit: 10,
  nodeSize: 26,
  railOffset: 30,
  railWidth: 2,
  dayFormat: 'dd MMM',
} as const;
