import {ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT} from '@/shared/constants/general';
import type {ChipConfig} from '@/shared/interfaces/workItem';

export const SUPERVISORY_VISIT_STATUS = {
  SCHEDULED: {
    value: 'SCHEDULED',
    labelKey: 'supervisoryVisits.statuses.scheduled',
    color: 'info',
  },
  OVERDUE: {
    value: 'OVERDUE',
    labelKey: 'supervisoryVisits.statuses.overdue',
    color: 'error',
  },
  UNDER_REVIEW: {
    value: 'UNDER_REVIEW',
    labelKey: 'supervisoryVisits.statuses.underReview',
    color: 'warning',
  },
  APPROVED: {
    value: 'APPROVED',
    labelKey: 'supervisoryVisits.statuses.approved',
    color: 'success',
  },
  CANCELLED: {
    value: 'CANCELLED',
    labelKey: 'supervisoryVisits.statuses.cancelled',
    color: 'secondary',
  },
} as const satisfies Record<string, ChipConfig>;

export const SUPERVISORY_VISIT_OPEN_STATUSES: string[] = [
  SUPERVISORY_VISIT_STATUS.SCHEDULED.value,
  SUPERVISORY_VISIT_STATUS.OVERDUE.value,
];

export const SUPERVISORY_VISIT_CANCELLABLE_STATUSES: string[] =
  SUPERVISORY_VISIT_OPEN_STATUSES.concat(
    SUPERVISORY_VISIT_STATUS.UNDER_REVIEW.value
  );

export const SUPERVISORY_VISIT_REVIEWABLE_STATUSES: string[] = [
  SUPERVISORY_VISIT_STATUS.UNDER_REVIEW.value,
];

// PREVENT-772: reopen removed for now; uncomment to restore.
// export const SUPERVISORY_VISIT_REOPENABLE_STATUSES: string[] = [
//   SUPERVISORY_VISIT_STATUS.APPROVED.value,
//   SUPERVISORY_VISIT_STATUS.CANCELLED.value,
// ];

export const SUPERVISORY_VISIT_TYPE = {
  ROUTINE: {
    value: 'ROUTINE',
    labelKey: 'supervisoryVisits.visitTypes.routine',
    color: 'primary',
  },
  TRIGGERED: {
    value: 'TRIGGERED',
    labelKey: 'supervisoryVisits.visitTypes.triggered',
    color: 'error',
  },
  OTHER: {
    value: 'OTHER',
    labelKey: 'supervisoryVisits.visitTypes.other',
    color: 'secondary',
  },
} as const satisfies Record<string, ChipConfig>;

export const SUPERVISORY_VISIT_TYPE_VALUES: string[] = Object.values(
  SUPERVISORY_VISIT_TYPE
).map(({value}) => value);

export const SUPERVISORY_VISIT_DEFAULT_TYPE =
  SUPERVISORY_VISIT_TYPE.ROUTINE.value;

export const SUPERVISORY_VISIT_OUTCOME = {
  NO_CONCERNS: {
    value: 'NO_CONCERNS',
    labelKey: 'supervisoryVisits.outcomes.noConcerns',
    color: 'success',
    icon: 'mdi:check',
  },
  CONCERNS_NOTED: {
    value: 'CONCERNS_NOTED',
    labelKey: 'supervisoryVisits.outcomes.concernsNoted',
    color: 'warning',
    icon: 'mdi:alert-circle-outline',
  },
  NOT_CONDUCTED: {
    value: 'NOT_CONDUCTED',
    labelKey: 'supervisoryVisits.outcomes.notConducted',
    color: 'error',
    icon: 'mdi:close-circle-outline',
  },
} as const satisfies Record<string, ChipConfig & {icon: string}>;

export const SUPERVISORY_VISIT_OUTCOME_VALUES: string[] = Object.values(
  SUPERVISORY_VISIT_OUTCOME
).map(({value}) => value);

export const SUPERVISORY_VISIT_SOURCE = {
  ALERT: {
    value: 'ALERT',
    labelKey: 'followUps.sources.alert',
    color: 'error',
  },
  STANDALONE: {
    value: 'STANDALONE',
    labelKey: 'followUps.sources.standalone',
    color: 'secondary',
  },
} as const satisfies Record<string, ChipConfig>;

// History timeline: label + dot colour per event type.
export const SUPERVISORY_VISIT_EVENT_TYPES: Record<string, ChipConfig> = {
  CREATED: {
    value: 'CREATED',
    labelKey: 'supervisoryVisits.events.created',
    color: 'primary',
  },
  REASSIGNED: {
    value: 'REASSIGNED',
    labelKey: 'supervisoryVisits.events.reassigned',
    color: 'info',
  },
  EDITED: {
    value: 'EDITED',
    labelKey: 'supervisoryVisits.events.edited',
    color: 'secondary',
  },
  BECAME_OVERDUE: {
    value: 'BECAME_OVERDUE',
    labelKey: 'supervisoryVisits.events.becameOverdue',
    color: 'error',
  },
  ESCALATED_TO_ADMIN: {
    value: 'ESCALATED_TO_ADMIN',
    labelKey: 'supervisoryVisits.events.escalatedToAdmin',
    color: 'error',
  },
  REMINDER_SENT: {
    value: 'REMINDER_SENT',
    labelKey: 'supervisoryVisits.events.reminderSent',
    color: 'secondary',
  },
  FILED: {
    value: 'FILED',
    labelKey: 'supervisoryVisits.events.filed',
    color: 'warning',
  },
  APPROVED: {
    value: 'APPROVED',
    labelKey: 'supervisoryVisits.events.approved',
    color: 'success',
  },
  CORRECTION_REQUESTED: {
    value: 'CORRECTION_REQUESTED',
    labelKey: 'supervisoryVisits.events.correctionRequested',
    color: 'warning',
  },
  CANCELLED: {
    value: 'CANCELLED',
    labelKey: 'supervisoryVisits.events.cancelled',
    color: 'secondary',
  },
  REOPENED: {
    value: 'REOPENED',
    labelKey: 'supervisoryVisits.events.reopened',
    color: 'warning',
  },
  FOLLOW_UPS_CREATED: {
    value: 'FOLLOW_UPS_CREATED',
    labelKey: 'supervisoryVisits.events.followUpsCreated',
    color: 'primary',
  },
};

// History "changed …" copy names the field in plain words, not the API field.
export const SUPERVISORY_VISIT_EDITABLE_FIELD_LABEL_KEYS: Record<
  string,
  string
> = {
  visitType: 'supervisoryVisits.fields.visitType',
  visitTypeOther: 'supervisoryVisits.fields.visitTypeOther',
  description: 'supervisoryVisits.fields.description',
  checklistTemplateId: 'supervisoryVisits.fields.checklistTemplateId',
  scheduledStartAt: 'supervisoryVisits.fields.scheduledStartAt',
  scheduledEndAt: 'supervisoryVisits.fields.scheduledEndAt',
  caregiverUserOrganizationIds:
    'supervisoryVisits.fields.caregiverUserOrganizationIds',
};

export const SUPERVISORY_VISIT_DEFAULT_START_TIME = '09:00';

export const SUPERVISORY_VISIT_DEFAULT_END_TIME = '10:00';

export const SUPERVISORY_VISIT_SCHEDULE_FORMATS = {
  date: 'dd MMM yyyy',
  dateShort: 'd MMM',
  time: 'HH:mm',
} as const;

export const SUPERVISORY_VISIT_TYPE_OTHER_MAX_LENGTH = 200;

export const SUPERVISORY_VISIT_TEXT_MAX_LENGTH = 5000;

export const SUPERVISORY_VISIT_REASON_MAX_LENGTH = 2000;

export const SUPERVISORY_VISIT_MAX_CAREGIVERS = 20;

export const SUPERVISORY_VISIT_MAX_QUEUED_FOLLOW_UPS = 10;

export const SUPERVISORY_VISIT_EVIDENCE_ACCEPT =
  ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT;

export const SUPERVISORY_VISIT_MAX_EVIDENCE_FILES = 5;

export const SUPERVISORY_VISIT_FORM_ID = 'supervisory-visit-form';

export const SUPERVISORY_VISIT_COMPLETE_FORM_ID =
  'supervisory-visit-complete-form';

// Multipart fields the complete endpoint reads evidence and queued tasks from.
export const SUPERVISORY_VISIT_EVIDENCE_FIELD = 'files';

export const SUPERVISORY_VISIT_FOLLOW_UPS_FIELD = 'followUps';

// Filing copy: an admin's filing is approved on the spot (see the backend
// `approvesOnFiling`), everyone else's goes to review.
export const SUPERVISORY_VISIT_FILING_COPY_KEYS = {
  review: {
    action: 'supervisoryVisits.actions.file',
    title: 'supervisoryVisits.complete.title',
    subtitle: 'supervisoryVisits.complete.subtitle',
    permanent: 'supervisoryVisits.complete.permanent',
    confirm: 'supervisoryVisits.complete.confirm',
  },
  approvedOnFiling: {
    action: 'supervisoryVisits.actions.fileAdmin',
    title: 'supervisoryVisits.complete.titleAdmin',
    subtitle: 'supervisoryVisits.complete.subtitleAdmin',
    permanent: 'supervisoryVisits.complete.permanentAdmin',
    confirm: 'supervisoryVisits.complete.confirmAdmin',
  },
} as const;

// Newest visits first, like follow-up tasks; matches the API default.
export const SUPERVISORY_VISIT_LIST_DEFAULT_SORT = {
  sortBy: 'createdAt',
  sortDir: 'desc',
} as const;
