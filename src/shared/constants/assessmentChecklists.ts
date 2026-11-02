import {RISK_FLAGS} from '@/shared/constants/submissions';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {StatusColor} from '@/shared/types/common';

export const ASSESSMENT_CHECKLIST_STATUS = {
  DRAFT: {
    value: 'DRAFT',
    labelKey: 'assessmentChecklists.status.draft',
    color: 'warning',
  },
  ACTIVE: {
    value: 'ACTIVE',
    labelKey: 'assessmentChecklists.status.active',
    color: 'success',
  },
  ARCHIVED: {
    value: 'ARCHIVED',
    labelKey: 'assessmentChecklists.status.archived',
    color: 'secondary',
  },
} as const;

export const ASSESSMENT_CHECKLIST_DATE_FORMAT = 'dd MMM yyyy';

export const CHECKLIST_TEMPLATE_TYPES = {
  PATIENT: {
    value: 'PATIENT',
    labelKey: 'assessmentChecklists.types.patient',
    hintKey: 'assessmentChecklists.typeHints.patient',
  },
  FOLLOW_UP: {
    value: 'FOLLOW_UP',
    labelKey: 'assessmentChecklists.types.followUp',
    hintKey: 'assessmentChecklists.typeHints.followUp',
  },
  SUPERVISORY_VISIT: {
    value: 'SUPERVISORY_VISIT',
    labelKey: 'assessmentChecklists.types.supervisoryVisit',
    hintKey: 'assessmentChecklists.typeHints.supervisoryVisit',
  },
} as const;

export const CHECKLIST_TEMPLATE_TYPE_VALUES = Object.values(
  CHECKLIST_TEMPLATE_TYPES
).map((type) => type.value);

// Orange is deliberately absent: answers only raise green, yellow or red.
export const CHECKLIST_OPTION_FLAGS = [
  RISK_FLAGS.GREEN,
  RISK_FLAGS.YELLOW,
  RISK_FLAGS.RED,
] as const;

export const CHECKLIST_CHOICE_FIELD_TYPES: readonly string[] = [
  CHECKLIST_FIELD_TYPES.SELECT,
  CHECKLIST_FIELD_TYPES.MULTI_SELECT,
];

export const CHECKLIST_SUBMISSION_STATUS = {
  UPCOMING: {value: 'UPCOMING', label: 'Upcoming', color: 'default'},
  PENDING: {value: 'PENDING', label: 'Pending', color: 'warning'},
  LATE: {value: 'LATE', label: 'Late', color: 'error'},
  SUBMITTED: {value: 'SUBMITTED', label: 'Submitted', color: 'info'},
  REVIEWED: {value: 'REVIEWED', label: 'Reviewed', color: 'success'},
  MISSED: {value: 'MISSED', label: 'Missed', color: 'secondary'},
  SKIPPED: {value: 'SKIPPED', label: 'Skipped', color: 'default'},
  VOIDED: {value: 'VOIDED', label: 'Voided', color: 'default'},
} as const;

export const VOIDABLE_STATUSES = [
  CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
  CHECKLIST_SUBMISSION_STATUS.REVIEWED.value,
  CHECKLIST_SUBMISSION_STATUS.MISSED.value,
] as const;

// Mirrors the backend SKIPPABLE_STATUSES.
export const SKIPPABLE_STATUSES = [
  CHECKLIST_SUBMISSION_STATUS.UPCOMING.value,
  CHECKLIST_SUBMISSION_STATUS.PENDING.value,
  CHECKLIST_SUBMISSION_STATUS.LATE.value,
] as const;

// Late or missed work is what a follow-up task can chase.
export const SUBMISSION_FOLLOW_UP_STATUSES = [
  CHECKLIST_SUBMISSION_STATUS.LATE.value,
  CHECKLIST_SUBMISSION_STATUS.MISSED.value,
] as const;

// One list tab per status; the tab key is the lowercased status.
export const SUBMISSION_LIST_TAB = {
  upcoming: 'upcoming',
  pending: 'pending',
  late: 'late',
  submitted: 'submitted',
  reviewed: 'reviewed',
  missed: 'missed',
  skipped: 'skipped',
  voided: 'voided',
} as const;

export const SUBMISSION_SCHEDULE_LABEL_KEYS: Record<string, string> = {
  DAILY: 'submissions.schedule.daily',
  WEEKLY: 'submissions.schedule.weekly',
  MONTHLY: 'submissions.schedule.monthly',
};

// Next-step copy per status; statuses without an entry need nothing.
export const SUBMISSION_GUIDANCE_KEYS: Record<string, string> = {
  [CHECKLIST_SUBMISSION_STATUS.UPCOMING.value]: 'submissions.guidance.upcoming',
  [CHECKLIST_SUBMISSION_STATUS.PENDING.value]: 'submissions.guidance.pending',
  [CHECKLIST_SUBMISSION_STATUS.LATE.value]: 'submissions.guidance.late',
  [CHECKLIST_SUBMISSION_STATUS.MISSED.value]: 'submissions.guidance.missed',
};

export const SUBMISSION_DAY_FORMAT = 'dd MMM yyyy';

export const SUBMISSION_DATE_TIME_FORMAT = 'dd MMM yyyy, hh:mm a';

export const SUBMISSION_REASON_MAX_LENGTH = 1000;

export const getSubmissionStatusConfig = ({
  status,
  t,
}: {
  status: string;
  t: (key: string) => string;
}): {label: string; color: StatusColor} => {
  const config: Record<string, {label: string; color: StatusColor}> = {
    [CHECKLIST_SUBMISSION_STATUS.UPCOMING.value]: {
      label: t('submissions.status.upcoming'),
      color: CHECKLIST_SUBMISSION_STATUS.UPCOMING.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.REVIEWED.value]: {
      label: t('submissions.status.reviewed'),
      color: CHECKLIST_SUBMISSION_STATUS.REVIEWED.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value]: {
      label: t('submissions.status.submitted'),
      color: CHECKLIST_SUBMISSION_STATUS.SUBMITTED.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.PENDING.value]: {
      label: t('submissions.status.pending'),
      color: CHECKLIST_SUBMISSION_STATUS.PENDING.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.LATE.value]: {
      label: t('submissions.status.late'),
      color: CHECKLIST_SUBMISSION_STATUS.LATE.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.MISSED.value]: {
      label: t('submissions.status.missed'),
      color: CHECKLIST_SUBMISSION_STATUS.MISSED.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.SKIPPED.value]: {
      label: t('submissions.status.skipped'),
      color: CHECKLIST_SUBMISSION_STATUS.SKIPPED.color,
    },
    [CHECKLIST_SUBMISSION_STATUS.VOIDED.value]: {
      label: t('submissions.status.voided'),
      color: CHECKLIST_SUBMISSION_STATUS.VOIDED.color,
    },
  };

  return config[status.toUpperCase()] || {label: 'N/A', color: 'default'};
};

const PATIENT_USAGE_ROWS = [
  {field: 'assignees', labelKey: 'assessmentChecklists.usage.caregivers'},
  {field: 'patients', labelKey: 'assessmentChecklists.usage.patients'},
  {field: 'total', labelKey: 'assessmentChecklists.usage.submissions'},
  {field: 'redFlags', labelKey: 'assessmentChecklists.usage.redFlags'},
  {
    field: 'lastActivityAt',
    labelKey: 'assessmentChecklists.usage.lastSubmission',
  },
] as const;

const caseManagerUsageRows = ({totalLabelKey}: {totalLabelKey: string}) =>
  [
    {field: 'assignees', labelKey: 'assessmentChecklists.usage.caseManagers'},
    {field: 'patients', labelKey: 'assessmentChecklists.usage.patients'},
    {field: 'total', labelKey: totalLabelKey},
    {field: 'completed', labelKey: 'assessmentChecklists.usage.completed'},
    {
      field: 'lastActivityAt',
      labelKey: 'assessmentChecklists.usage.lastCompleted',
    },
  ] as const;

// What each usage count means depends on what the checklist is used for.
export const CHECKLIST_USAGE_ROWS = {
  [CHECKLIST_TEMPLATE_TYPES.PATIENT.value]: PATIENT_USAGE_ROWS,
  [CHECKLIST_TEMPLATE_TYPES.FOLLOW_UP.value]: caseManagerUsageRows({
    totalLabelKey: 'assessmentChecklists.usage.tasks',
  }),
  [CHECKLIST_TEMPLATE_TYPES.SUPERVISORY_VISIT.value]: caseManagerUsageRows({
    totalLabelKey: 'assessmentChecklists.usage.visits',
  }),
};

export const ASSESSMENT_CHECKLIST_DEFAULTS = {
  emptyText: '',
  questionType: CHECKLIST_FIELD_TYPES.TEXTAREA,
  sortOrder: 0,
} as const;
