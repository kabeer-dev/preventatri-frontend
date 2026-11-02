import type React from 'react';

import type {ThemeColor} from '@/@core/theme/types';
import {
  CheckMarkIcon,
  ExclamationIcon,
  WarningIcon,
} from '@/shared/components/icons';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import type {IconProps} from '@/shared/interfaces/common';
import type {ActiveFlagAccentConfig} from '@/shared/interfaces/flag';
import {SeverityLevel} from '@/shared/types/severity';

export const FLAG_TYPES = {
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green',
} as const;

// Flag colour values accepted by the emergency-flags list `flag` query filter.
// The API stores/expects them uppercase (RED/YELLOW). GREEN is intentionally
// excluded — the backend returns a 400 if flag=GREEN is passed.
export const EMERGENCY_FLAG_FILTERS = {
  RED: 'RED',
  YELLOW: 'YELLOW',
} as const;

// i18n key per emergency-flag filter value. Single source for both the filter
// dropdown options and the active-filter chip label (resolved from the id-only
// URL value).
export const EMERGENCY_FLAG_FILTER_LABEL_KEYS: Record<string, string> = {
  [EMERGENCY_FLAG_FILTERS.RED]: SEVERITY_LEVELS.critical.labelKey,
  [EMERGENCY_FLAG_FILTERS.YELLOW]: SEVERITY_LEVELS.moderate.labelKey,
};

// How a flag was raised. `auto` flags are generated from a checklist
// submission and carry the full scored submission (sections + answers);
// `manual` flags are raised directly by a caregiver.
export const FLAG_DETAIL_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
} as const;

export const ACTIVE_FLAG_MODAL_WIDTH = 600;

export const SLA_BREACH_CARD_SIZES = {
  iconTile: 40,
  icon: 22,
} as const;

export const ACTIVE_FLAG_MODAL_SIZES = {
  iconTile: 46,
  iconRing: 5,
  outerGlow: 6,
  initials: 28,
  fieldMinHeight: 44,
  primaryActionHeight: 46,
  countdownHeight: 34,
  countdownDigitsMinWidth: 58,
  queueBadgeMinWidth: 30,
  queueBadgeHeight: 26,
} as const;

// The tile sits on the solid severity bar colour, so the glyph needs its own
// contrast colour: white on the dark red and green bars, ink on the pale yellow.
export const ACTIVE_FLAG_ACCENTS: Record<
  SeverityLevel,
  ActiveFlagAccentConfig
> = {
  critical: {
    edge: 'severityCriticalBar',
    tileGlyphColor: 'common.white',
    glyphSize: 20,
    isPulsing: true,
  },
  moderate: {
    edge: 'severityModerateBar',
    tileGlyphColor: 'customColors.severityModerateFg',
    glyphSize: 24,
    isPulsing: false,
  },
  stable: {
    edge: 'severityStableBar',
    tileGlyphColor: 'common.white',
    glyphSize: 20,
    isPulsing: false,
  },
};

// Integer codes the resolve-escalation API expects in its `actions` array
// (mirrors backend ESCALATION_RESPONSE_ACTIONS).
export const MAX_RESOLUTION_ATTACHMENTS = 5;

export const ESCALATION_RESPONSE_ACTIONS = {
  GUIDED_CAREGIVER_ON_CALL: 0,
  GUIDED_PATIENT_ON_CALL: 1,
  SENT_INSTRUCTIONS: 2,
  TEAM_DISPATCHED: 3,
} as const;

// The resolve form's name for each follow-up task field it embeds.
export const ACTION_TAKEN_FOLLOW_UP_FIELDS = {
  title: 'followUpTitle',
  description: 'followUpDescription',
  priority: 'followUpPriority',
  dueDate: 'followUpDate',
  dueTime: 'followUpTime',
  checklistTemplateId: 'followUpChecklistTemplateId',
} as const;

export const ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS = {
  scheduledDate: 'supervisoryVisitDate',
  startTime: 'supervisoryVisitStartTime',
  endTime: 'supervisoryVisitEndTime',
  checklistTemplateId: 'supervisoryVisitChecklistTemplateId',
} as const;

export const ACTION_TAKEN_CHECKBOXES = [
  {
    name: 'guidedCaregiverOnCall',
    value: ESCALATION_RESPONSE_ACTIONS.GUIDED_CAREGIVER_ON_CALL,
    labelKey: 'flag.actionTaken.guidedCaregiverOnCall',
  },
  {
    name: 'guidedPatientOnCall',
    value: ESCALATION_RESPONSE_ACTIONS.GUIDED_PATIENT_ON_CALL,
    labelKey: 'flag.actionTaken.guidedPatientOnCall',
  },
  {
    name: 'sentInstructionsToEmail',
    value: ESCALATION_RESPONSE_ACTIONS.SENT_INSTRUCTIONS,
    labelKey: 'flag.actionTaken.sentInstructionsToEmail',
  },
  {
    name: 'teamDispatched',
    value: ESCALATION_RESPONSE_ACTIONS.TEAM_DISPATCHED,
    labelKey: 'flag.actionTaken.teamDispatched',
  },
] as const;

export type ActionCheckboxName =
  (typeof ACTION_TAKEN_CHECKBOXES)[number]['name'];

// Mirrors backend ESCALATION_ACTIONS (escalationConstants.js). Each escalation
// timeline entry records one of these against the level it occurred at.
export const ESCALATION_ACTIONS = {
  STARTED: 'STARTED',
  ASSIGNED: 'ASSIGNED',

  // The assignee accepted the flag; it stops escalating there.
  ACCEPTED: 'ACCEPTED',
  ESCALATED: 'ESCALATED',
  RESOLVED: 'RESOLVED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  VOIDED: 'VOIDED',
} as const;

// Theme color used for the timeline dot / avatar of each escalation action so
// the history reads at a glance (escalated = caution, resolved = success, etc.).
export const ESCALATION_ACTION_COLORS: Record<string, ThemeColor> = {
  [ESCALATION_ACTIONS.STARTED]: 'primary',
  [ESCALATION_ACTIONS.ASSIGNED]: 'info',
  [ESCALATION_ACTIONS.ACCEPTED]: 'primary',
  [ESCALATION_ACTIONS.ESCALATED]: 'warning',
  [ESCALATION_ACTIONS.RESOLVED]: 'success',
  [ESCALATION_ACTIONS.EXPIRED]: 'error',
  [ESCALATION_ACTIONS.FAILED]: 'error',
  [ESCALATION_ACTIONS.VOIDED]: 'secondary',
};

export const ESCALATION_FALLBACK_COLOR: ThemeColor = 'secondary';

// Display format for the activity timeline's assigned/ended timestamps.
export const TIMELINE_TIMESTAMP_FORMAT = 'dd MMM yyyy, hh:mm a';

// The alert history splits that timestamp in two: the day sits in its own
// gutter, the clock time in the line beneath the entry.
export const TIMELINE_DATE_FORMAT = 'dd MMM';

export const TIMELINE_TIME_FORMAT = 'hh:mm a';

// Current condition of a red flag, mirrored from the backend (escalation
// status, with VOIDED layered on top from the flag's voidedAt). Drives the
// detail header's title, subtitle, color and icon.
export const RED_FLAG_STATUSES = {
  ACTIVE: 'ACTIVE',

  // Accepted by the escalation assignee: no longer escalating, not resolved.
  ACCEPTED: 'ACCEPTED',
  RESOLVED: 'RESOLVED',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
  VOIDED: 'VOIDED',
} as const;

// Presentation for each red flag condition shown in the detail header. Colors
// align with ESCALATION_ACTION_COLORS so the header reads consistently with the
// activity timeline (resolved = success, escalation failures = error, etc.).
export const RED_FLAG_STATUS_PRESENTATION: Record<
  (typeof RED_FLAG_STATUSES)[keyof typeof RED_FLAG_STATUSES],
  {color: ThemeColor; icon: string; titleKey: string; subtitleKey: string}
> = {
  [RED_FLAG_STATUSES.ACTIVE]: {
    color: 'error',
    icon: 'mdi:alert-circle-outline',
    titleKey: 'redFlags.detail.status.active.title',
    subtitleKey: 'redFlags.detail.status.active.subtitle',
  },
  [RED_FLAG_STATUSES.ACCEPTED]: {
    color: 'info',
    icon: 'mdi:account-check-outline',
    titleKey: 'redFlags.detail.status.accepted.title',
    subtitleKey: 'redFlags.detail.status.accepted.subtitle',
  },
  [RED_FLAG_STATUSES.RESOLVED]: {
    color: 'success',
    icon: 'mdi:check-circle-outline',
    titleKey: 'redFlags.detail.status.resolved.title',
    subtitleKey: 'redFlags.detail.status.resolved.subtitle',
  },
  [RED_FLAG_STATUSES.EXPIRED]: {
    color: 'warning',
    icon: 'mdi:clock-alert-outline',
    titleKey: 'redFlags.detail.status.expired.title',
    subtitleKey: 'redFlags.detail.status.expired.subtitle',
  },
  [RED_FLAG_STATUSES.FAILED]: {
    color: 'error',
    icon: 'mdi:alert-octagon-outline',
    titleKey: 'redFlags.detail.status.failed.title',
    subtitleKey: 'redFlags.detail.status.failed.subtitle',
  },
  [RED_FLAG_STATUSES.VOIDED]: {
    color: 'secondary',
    icon: 'mdi:cancel',
    titleKey: 'redFlags.detail.status.voided.title',
    subtitleKey: 'redFlags.detail.status.voided.subtitle',
  },
};

export const YELLOW_FLAG_STATUS_PRESENTATION: Record<
  (typeof RED_FLAG_STATUSES)[keyof typeof RED_FLAG_STATUSES],
  {color: ThemeColor; icon: string; titleKey: string; subtitleKey: string}
> = {
  [RED_FLAG_STATUSES.ACTIVE]: {
    color: 'warning',
    icon: 'mdi:alert-outline',
    titleKey: 'redFlags.detail.status.yellowActive.title',
    subtitleKey: 'redFlags.detail.status.yellowActive.subtitle',
  },
  [RED_FLAG_STATUSES.ACCEPTED]: {
    color: 'info',
    icon: 'mdi:account-check-outline',
    titleKey: 'redFlags.detail.status.yellowAccepted.title',
    subtitleKey: 'redFlags.detail.status.yellowAccepted.subtitle',
  },
  [RED_FLAG_STATUSES.RESOLVED]: {
    color: 'success',
    icon: 'mdi:check-circle-outline',
    titleKey: 'redFlags.detail.status.yellowResolved.title',
    subtitleKey: 'redFlags.detail.status.yellowResolved.subtitle',
  },
  [RED_FLAG_STATUSES.EXPIRED]: {
    color: 'warning',
    icon: 'mdi:clock-alert-outline',
    titleKey: 'redFlags.detail.status.yellowExpired.title',
    subtitleKey: 'redFlags.detail.status.yellowExpired.subtitle',
  },
  [RED_FLAG_STATUSES.FAILED]: {
    color: 'error',
    icon: 'mdi:alert-octagon-outline',
    titleKey: 'redFlags.detail.status.yellowFailed.title',
    subtitleKey: 'redFlags.detail.status.yellowFailed.subtitle',
  },
  [RED_FLAG_STATUSES.VOIDED]: {
    color: 'secondary',
    icon: 'mdi:cancel',
    titleKey: 'redFlags.detail.status.yellowVoided.title',
    subtitleKey: 'redFlags.detail.status.yellowVoided.subtitle',
  },
};

export const FLAG_ICONS: Record<
  (typeof FLAG_TYPES)[keyof typeof FLAG_TYPES],
  React.FC<IconProps>
> = {
  [FLAG_TYPES.RED]: ExclamationIcon,
  [FLAG_TYPES.YELLOW]: WarningIcon,
  [FLAG_TYPES.GREEN]: CheckMarkIcon,
};
