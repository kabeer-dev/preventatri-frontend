import {OPEN_MODERATE_ALERTS_HREF} from '@/shared/constants/listToolbarTabs';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import {AlertSummaryCardConfig} from '@/shared/interfaces/alertSummary';
import {formatMinutes} from '@/shared/utils/alertReview';

export const ALERT_SUMMARY_CARD = {
  tileSize: 38,
  glyphSize: 15,
  valueSize: 26,
  labelSize: '12.5px',
  scopeSize: 11,
} as const;

const OPEN_ALERT_CARDS: AlertSummaryCardConfig[] = [
  {
    id: 'openCritical',
    labelKey: 'alertSummary.openCritical',
    scopeKey: 'alertSummary.scopeNow',
    glyph: SEVERITY_LEVELS.critical.glyph,
    tileBackground: 'customColors.severityCriticalBg',
    tileColor: 'customColors.severityCriticalFg',
    valueColor: 'customColors.severityCriticalFg',
    countKey: 'activeRedFlags',
  },
  {
    id: 'openModerate',
    labelKey: 'alertSummary.openModerate',
    scopeKey: 'alertSummary.scopeNow',
    glyph: SEVERITY_LEVELS.moderate.glyph,
    tileBackground: 'customColors.severityModerateBg',
    tileColor: 'customColors.severityModerateFg',
    valueColor: 'customColors.severityModerateFg',
    countKey: 'activeYellowFlags',
    href: OPEN_MODERATE_ALERTS_HREF,
  },
  {
    id: 'slaBreaches',
    labelKey: 'alertSummary.slaBreaches',
    scopeKey: 'alertSummary.scopeThirtyDays',
    glyph: 'mdi:timer-off-outline',
    tileBackground: 'customColors.severityCriticalBg',
    tileColor: 'customColors.severityCriticalFg',
    valueColor: 'customColors.severityCriticalFg',
    countKey: 'slaBreaches',
  },
];

export const ALERT_SUMMARY_CARDS: AlertSummaryCardConfig[] = [
  ...OPEN_ALERT_CARDS,
  {
    id: 'averageResolution',
    labelKey: 'alertSummary.averageResolution',
    scopeKey: 'alertSummary.scopeThirtyDays',
    glyph: SEVERITY_LEVELS.stable.glyph,
    tileBackground: 'customColors.severityStableBg',
    tileColor: 'customColors.severityStableFg',
    valueColor: 'text.primary',
    countKey: 'averageResolutionMinutes',
    formatValue: ({value}) => formatMinutes({totalMinutes: Math.round(value)}),
  },
];

// greenFlags is not limited to 30 days; it stands in until the backend returns
// stableLast30Days.
export const TRIAGE_SUMMARY_CARDS: AlertSummaryCardConfig[] = [
  ...OPEN_ALERT_CARDS,
  {
    id: 'totalStable',
    labelKey: 'alertSummary.totalStable',
    scopeKey: 'alertSummary.scopeThirtyDays',
    glyph: SEVERITY_LEVELS.stable.glyph,
    tileBackground: 'customColors.severityStableBg',
    tileColor: 'customColors.severityStableFg',
    valueColor: 'customColors.severityStableFg',
    countKey: 'stableLast30Days',
    fallbackCountKey: 'greenFlags',
  },
];
