import type {ChipProps} from '@mui/material/Chip';

import {RED_FLAG_STATUSES} from '@/shared/constants/flag';

export const RED_FLAG_REASONS: Record<
  number,
  {label: string; value: number; code: string}
> = {
  0: {label: 'Fall or Injury', value: 0, code: 'fall_or_injury'},
  1: {label: 'Sudden Health Decline', value: 1, code: 'sudden_health_decline'},
  2: {label: 'Unresponsive / Unconscious', value: 2, code: 'unresponsive'},
  3: {label: 'Severe Pain', value: 3, code: 'severe_pain'},
  4: {label: 'Difficulty Breathing', value: 4, code: 'difficulty_breathing'},
  5: {label: 'Medication Issue', value: 5, code: 'medication_issue'},
  6: {label: 'Other', value: 6, code: 'other'},
};

// Assessment flags carry no form reason code until the backend sends one.
export const FLAGGED_ASSESSMENT_REASON = 'Flagged assessment';

export const RED_FLAG_REASON_OPTIONS = Object.values(RED_FLAG_REASONS).map(
  ({label, value}) => ({label, value})
);

/**
 * The reason the backend already accepts when nothing else fits. Picking it
 * opens a short text field, and that text is carried to the nurse at the front
 * of the description, because the API stores no free-text reason of its own.
 */
export const RED_FLAG_OTHER_REASON = RED_FLAG_REASONS[6].value;

/** How long the free text behind "Other" may be. */
export const RED_FLAG_OTHER_REASON_LIMIT = 120;

/**
 * How long a description the API stores. The "Other" text is carried inside
 * the description, so the two are measured together against this.
 */
export const RED_FLAG_DESCRIPTION_LIMIT = 1000;

export const RED_FLAG_STATUS = {
  PENDING: {value: 'PENDING', label: 'Pending', color: 'warning'},

  // The escalation assignee took it: it stops escalating until resolved.
  ACCEPTED: {value: 'ACCEPTED', label: 'Accepted', color: 'info'},
  RESOLVED: {value: 'RESOLVED', label: 'Resolved', color: 'success'},
  VOIDED: {value: 'VOIDED', label: 'Voided', color: 'default'},
} as const;

// A red flag can only be voided while it is still open (pending or accepted);
// resolved or already-voided flags are terminal and not voidable.
export const RED_FLAG_VOIDABLE_STATUSES = [
  RED_FLAG_STATUS.PENDING.value,
  RED_FLAG_STATUS.ACCEPTED.value,
] as const;

// The list API calls an unresolved flag PENDING (or ACCEPTED once taken), the
// detail and triage APIs call it ACTIVE, so all count as still open.
export const RED_FLAG_OPEN_STATUSES: readonly string[] = [
  RED_FLAG_STATUS.PENDING.value,
  RED_FLAG_STATUS.ACCEPTED.value,
  RED_FLAG_STATUSES.ACTIVE,
];

// The list status filter for open flags (comma-separated, as the API reads it).
export const RED_FLAG_OPEN_STATUS_FILTER = [
  RED_FLAG_STATUS.PENDING.value,
  RED_FLAG_STATUS.ACCEPTED.value,
].join(',');

export const getRedFlagStatusConfig = ({
  status,
  t,
}: {
  status: string;
  t: (key: string) => string;
}): {label: string; color: ChipProps['color']} => {
  const config: Record<string, {label: string; color: ChipProps['color']}> = {
    [RED_FLAG_STATUS.PENDING.value]: {
      label: t('emergencyFlags.status.pending'),
      color: RED_FLAG_STATUS.PENDING.color,
    },
    [RED_FLAG_STATUSES.ACTIVE]: {
      label: t('emergencyFlags.status.pending'),
      color: RED_FLAG_STATUS.PENDING.color,
    },
    [RED_FLAG_STATUS.ACCEPTED.value]: {
      label: t('emergencyFlags.status.accepted'),
      color: RED_FLAG_STATUS.ACCEPTED.color,
    },
    [RED_FLAG_STATUS.RESOLVED.value]: {
      label: t('emergencyFlags.status.resolved'),
      color: RED_FLAG_STATUS.RESOLVED.color,
    },
    [RED_FLAG_STATUS.VOIDED.value]: {
      label: t('emergencyFlags.status.voided'),
      color: RED_FLAG_STATUS.VOIDED.color,
    },
  };

  return config[status?.toUpperCase()] || {label: 'N/A', color: 'default'};
};
