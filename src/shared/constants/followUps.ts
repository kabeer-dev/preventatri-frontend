import {ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT} from '@/shared/constants/general';
import type {FollowUpChipConfig} from '@/shared/interfaces/followUp';

export const FOLLOW_UP_TASK_STATUS = {
  PENDING: {
    value: 'PENDING',
    labelKey: 'followUps.statuses.pending',
    color: 'warning',
  },
  OVERDUE: {
    value: 'OVERDUE',
    labelKey: 'followUps.statuses.overdue',
    color: 'error',
  },
  COMPLETED: {
    value: 'COMPLETED',
    labelKey: 'followUps.statuses.completed',
    color: 'success',
  },
  CANCELLED: {
    value: 'CANCELLED',
    labelKey: 'followUps.statuses.cancelled',
    color: 'secondary',
  },
} as const satisfies Record<string, FollowUpChipConfig>;

export const FOLLOW_UP_TASK_OPEN_STATUSES: string[] = [
  FOLLOW_UP_TASK_STATUS.PENDING.value,
  FOLLOW_UP_TASK_STATUS.OVERDUE.value,
];

// PREVENT-772: reopen removed for now; uncomment to restore.
// export const FOLLOW_UP_TASK_REOPENABLE_STATUSES: string[] = [
//   FOLLOW_UP_TASK_STATUS.COMPLETED.value,
//   FOLLOW_UP_TASK_STATUS.CANCELLED.value,
// ];

export const FOLLOW_UP_TASK_PRIORITY = {
  LOW: {value: 'LOW', labelKey: 'followUps.priorities.low', color: 'secondary'},
  NORMAL: {
    value: 'NORMAL',
    labelKey: 'followUps.priorities.normal',
    color: 'primary',
  },
  HIGH: {value: 'HIGH', labelKey: 'followUps.priorities.high', color: 'error'},
} as const satisfies Record<string, FollowUpChipConfig>;

export const FOLLOW_UP_TASK_PRIORITY_VALUES: string[] = Object.values(
  FOLLOW_UP_TASK_PRIORITY
).map(({value}) => value);

export const FOLLOW_UP_TASK_DEFAULT_PRIORITY =
  FOLLOW_UP_TASK_PRIORITY.NORMAL.value;

export const FOLLOW_UP_TASK_OUTCOME = {
  DONE: {
    value: 'DONE',
    labelKey: 'followUps.outcomes.done',
    color: 'success',
    icon: 'mdi:check',
  },
  DONE_WITH_ISSUES: {
    value: 'DONE_WITH_ISSUES',
    labelKey: 'followUps.outcomes.doneWithIssues',
    color: 'warning',
    icon: 'mdi:alert-circle-outline',
  },
  COULD_NOT_COMPLETE: {
    value: 'COULD_NOT_COMPLETE',
    labelKey: 'followUps.outcomes.couldNotComplete',
    color: 'error',
    icon: 'mdi:close-circle-outline',
  },
} as const satisfies Record<string, FollowUpChipConfig & {icon: string}>;

export const FOLLOW_UP_TASK_OUTCOME_VALUES: string[] = Object.values(
  FOLLOW_UP_TASK_OUTCOME
).map(({value}) => value);

export const FOLLOW_UP_TASK_SOURCE = {
  ALERT: {
    value: 'ALERT',
    labelKey: 'followUps.sources.alert',
    color: 'error',
  },
  SUPERVISORY_VISIT: {
    value: 'SUPERVISORY_VISIT',
    labelKey: 'followUps.sources.supervisoryVisit',
    color: 'info',
  },
  STANDALONE: {
    value: 'STANDALONE',
    labelKey: 'followUps.sources.standalone',
    color: 'secondary',
  },
} as const satisfies Record<string, FollowUpChipConfig>;

// History timeline: label + dot colour per event type.
export const FOLLOW_UP_TASK_EVENT_TYPES: Record<string, FollowUpChipConfig> = {
  CREATED: {
    value: 'CREATED',
    labelKey: 'followUps.events.created',
    color: 'primary',
  },
  REASSIGNED: {
    value: 'REASSIGNED',
    labelKey: 'followUps.events.reassigned',
    color: 'info',
  },
  EDITED: {
    value: 'EDITED',
    labelKey: 'followUps.events.edited',
    color: 'secondary',
  },
  BECAME_OVERDUE: {
    value: 'BECAME_OVERDUE',
    labelKey: 'followUps.events.becameOverdue',
    color: 'error',
  },
  ESCALATED_TO_ADMIN: {
    value: 'ESCALATED_TO_ADMIN',
    labelKey: 'followUps.events.escalatedToAdmin',
    color: 'error',
  },
  REMINDER_SENT: {
    value: 'REMINDER_SENT',
    labelKey: 'followUps.events.reminderSent',
    color: 'secondary',
  },
  COMPLETED: {
    value: 'COMPLETED',
    labelKey: 'followUps.events.completed',
    color: 'success',
  },
  CANCELLED: {
    value: 'CANCELLED',
    labelKey: 'followUps.events.cancelled',
    color: 'secondary',
  },
  REOPENED: {
    value: 'REOPENED',
    labelKey: 'followUps.events.reopened',
    color: 'warning',
  },
};

export const FOLLOW_UP_TASK_FLAG_TYPES: Record<
  number,
  {value: number; code: string; label: string; color: string}
> = {
  0: {value: 0, code: 'red', label: 'Red Flag', color: 'error'},
  1: {value: 1, code: 'yellow', label: 'Yellow Flag', color: 'warning'},
  2: {value: 2, code: 'manual', label: 'Other', color: 'info'},
};

export const FOLLOW_UP_CARE_TEAM_ROLE_LABEL_KEYS: Record<string, string> = {
  PATIENT_PRIMARY_NURSE: 'followUps.careTeam.patientPrimaryNurse',
  PATIENT_SECONDARY_NURSE: 'followUps.careTeam.patientSecondaryNurse',
  REGION_DEFAULT_NURSE: 'followUps.careTeam.regionDefaultNurse',
  CASE_MANAGER: 'followUps.careTeam.caseManager',
  CAREGIVER: 'followUps.careTeam.caregiver',
  ADMIN: 'followUps.careTeam.admin',
};

// History "changed …" copy names the form field, not the API field.
export const FOLLOW_UP_EDITABLE_FIELD_LABEL_KEYS: Record<string, string> = {
  title: 'followUps.create.task',
  description: 'followUps.create.description',
  visitInstructions: 'followUps.create.visitNotes',
  priority: 'followUps.create.priority',
  dueAt: 'followUps.create.dueDate',
  checklistTemplateId: 'followUps.create.checklist',
};

export const FOLLOW_UP_DUE_TIME_DEFAULT = '17:00';

export const FOLLOW_UP_DUE_FORMATS = {
  date: 'dd MMM yyyy',
  dateShort: 'd MMM',
  time: 'HH:mm',
  dateTime: 'dd MMM yyyy · HH:mm',
  history: 'dd MMM · HH:mm',
} as const;

export const FOLLOW_UP_TITLE_MAX_LENGTH = 200;

export const FOLLOW_UP_TEXT_MAX_LENGTH = 5000;

export const FOLLOW_UP_CANCEL_REASON_MAX_LENGTH = 2000;

export const FOLLOW_UP_EVIDENCE_ACCEPT = ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT;

export const FOLLOW_UP_MAX_EVIDENCE_FILES = 5;

export const FOLLOW_UP_FORM_ID = 'follow-up-form';

export const FOLLOW_UP_COMPLETE_FORM_ID = 'follow-up-complete-form';

// Multipart field the complete endpoint reads evidence files from.
export const FOLLOW_UP_COMPLETE_EVIDENCE_FIELD = 'files';

// Newest tasks first; matches the API default.
export const FOLLOW_UP_LIST_DEFAULT_SORT = {
  sortBy: 'createdAt',
  sortDir: 'desc',
} as const;

export const FOLLOW_UP_OVERDUE_SUMMARY_PARAMS = {
  status: FOLLOW_UP_TASK_STATUS.OVERDUE.value,
  sortBy: 'dueAt',
  sortDir: 'asc',
  page: 1,
  limit: 1,
};

// Caregiver Today card: open tasks, nearest due first.
export const FOLLOW_UP_CAREGIVER_CARD_PARAMS = {
  status: FOLLOW_UP_TASK_OPEN_STATUSES.join(','),
  sortBy: 'dueAt',
  sortDir: 'asc',
  page: 1,
  limit: 5,
};

export const MINUTES_PER_HOUR = 60;

export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

export const MS_PER_MINUTE = 60 * 1000;
