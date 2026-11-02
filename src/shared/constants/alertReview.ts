import {radius} from '@/@core/theme/spacing';
import {RISK_FLAGS} from '@/shared/constants/submissions';
import {CustomColorKey} from '@/shared/types/alertReview';
import {SeverityLevel} from '@/shared/types/severity';

export const ALERT_REVIEW_COLUMNS = {
  wide: 'minmax(240px, 3fr) minmax(0, 5fr) minmax(320px, 4fr)',
  withoutResolution: 'minmax(240px, 3fr) minmax(0, 9fr)',
} as const;

export const ALERT_REVIEW_SIZES = {
  contentMaxWidth: 1440,
  answerGlyphWidth: 14,
  answerThumbnail: 56,
  evidenceThumbnail: 100,
  clockDigits: 26,
  actionBar: 4,
  factLabelWidth: 84,
  peopleLabelWidth: 72,
  patientLabelWidth: 112,
  avatar: 36,
} as const;

export const DEFAULT_ALERT_SEVERITY: SeverityLevel = 'critical';

export const SEVERITY_TONE_TOKENS: Record<
  SeverityLevel,
  {bar: CustomColorKey; tint: CustomColorKey; ink: CustomColorKey}
> = {
  critical: {
    bar: 'severityCriticalBar',
    tint: 'severityCriticalBg',
    ink: 'severityCriticalFg',
  },
  moderate: {
    bar: 'severityModerateBar',
    tint: 'severityModerateBg',
    ink: 'severityModerateFg',
  },
  stable: {
    bar: 'severityStableBar',
    tint: 'severityStableBg',
    ink: 'severityStableFg',
  },
};

export const ALERT_REVIEW_PILL_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1.5,
  px: 2.5,
  py: 0.75,
  borderRadius: `${radius.full}px`,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
} as const;

export const ALERT_REVIEW_OVERLINE_SX = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
} as const;

export const ALERT_REVIEW_ROW_SX = {
  px: 4.5,
  borderTop: '1px solid',
  borderColor: 'customColors.rule',
} as const;

export const ALERT_REVIEW_QUOTE_SX = {
  p: 3,
  borderRadius: `${radius.sm}px`,
  border: '1px solid',
  borderColor: 'customColors.ruleStrong',
  backgroundColor: 'customColors.surfaceRaised',
  color: 'text.secondary',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
} as const;

export const SEVERITY_ON_DARK_LIGHTEN: Record<SeverityLevel, number> = {
  critical: 0.45,
  moderate: 0,
  stable: 0.25,
};

export const ANSWER_TONES: Record<
  SeverityLevel,
  {glyphColor: string; answerColor: string}
> = {
  critical: {
    glyphColor: 'customColors.severityCriticalFg',
    answerColor: 'customColors.severityCriticalFg',
  },
  moderate: {
    glyphColor: 'customColors.severityModerateBar',
    answerColor: 'customColors.severityModerateFg',
  },
  stable: {
    glyphColor: 'customColors.severityStableBar',
    answerColor: 'text.primary',
  },
};

export const UNSCORED_ANSWER_GLYPH = '·';

export const RISK_FLAG_RANK: Record<string, number> = {
  [RISK_FLAGS.GREEN]: 1,
  [RISK_FLAGS.AMBER]: 2,
  [RISK_FLAGS.YELLOW]: 2,
  [RISK_FLAGS.RED]: 3,
};

export const FLAGGED_RISK_RANK = RISK_FLAG_RANK[RISK_FLAGS.YELLOW];

export const TRUTHY_ANSWER_VALUES: unknown[] = [true, 'true', 'yes'];

export const ANSWER_DATE_FORMAT = 'dd MMM yyyy';

export const MINUTES_PER_HOUR = 60;

export const HOURS_PER_DAY = 24;
