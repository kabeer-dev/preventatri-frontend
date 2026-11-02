import {SeverityConfig} from '@/shared/interfaces/severity';
import {SeverityLevel} from '@/shared/types/severity';

export const SEVERITY_LEVELS: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    glyph: 'mdi:alert',
    labelKey: 'severity.critical',
    bg: 'severityCriticalBg',
    fg: 'severityCriticalFg',
  },
  moderate: {
    glyph: 'mdi:alert-circle-outline',
    labelKey: 'severity.moderate',
    bg: 'severityModerateBg',
    fg: 'severityModerateFg',
  },
  stable: {
    glyph: 'mdi:check',
    labelKey: 'severity.stable',
    bg: 'severityStableBg',
    fg: 'severityStableFg',
  },
};

export const FLAG_TO_SEVERITY: Record<string, SeverityLevel> = {
  red: 'critical',
  yellow: 'moderate',
  amber: 'moderate',
  green: 'stable',
};

export const SEVERITY_PILL = {
  fontSize: '12.5px',
  fontWeight: 600,
  paddingX: '11px',
  paddingY: '4px',
} as const;
