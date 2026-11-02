import {
  FOLLOW_UP_DUE_FORMATS,
  FOLLOW_UP_EDITABLE_FIELD_LABEL_KEYS,
  FOLLOW_UP_TASK_EVENT_TYPES,
  FOLLOW_UP_TASK_OUTCOME,
  FOLLOW_UP_TASK_PRIORITY,
  FOLLOW_UP_TASK_SOURCE,
  FOLLOW_UP_TASK_STATUS,
  MINUTES_PER_HOUR,
  MS_PER_MINUTE,
} from '@/shared/constants/followUps';
import {ActivityLogEntry} from '@/shared/interfaces/activityTimeline';
import {
  FollowUpEvent,
  FollowUpSource,
  FollowUpTask,
  FollowUpTaskPayload,
  FollowUpTaskUpdatePayload,
} from '@/shared/interfaces/followUp';
import {Patient} from '@/shared/interfaces/patient';
import {TranslateFunction} from '@/shared/types/common';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {
  combineDateAndTime,
  DateTime,
  formatIso,
  formatZoneAbbreviation,
  fromIso,
  getDaysUntil,
  getMillis,
  getMinutesUntil,
} from '@/shared/utils/dateUtils';
import {
  buildPatientFromWorkItem,
  findChipConfig,
  formatDurationLabel,
  getAlertTypeLabelKey,
  getAssigneeName,
  mapEventToTimelineEntry as mapWorkItemEvent,
} from '@/shared/utils/workItemUtils';

// Shared with supervisory visits; re-exported so follow-up imports stay put.
export {
  flattenSections,
  formatDurationLabel,
  formatHistoryTime,
  getAlertTypeLabelKey,
  getAssigneeName,
  getPersonName,
  getRoleLabel,
} from '@/shared/utils/workItemUtils';

export const buildPatientFromTask = ({task}: {task: FollowUpTask}): Patient =>
  buildPatientFromWorkItem({patientId: task.patientId, patient: task.patient});

export const getStatusConfig = ({status}: {status?: string | null}) =>
  findChipConfig({catalog: FOLLOW_UP_TASK_STATUS, value: status});

export const getPriorityConfig = ({priority}: {priority?: string | null}) =>
  findChipConfig({catalog: FOLLOW_UP_TASK_PRIORITY, value: priority});

export const getOutcomeConfig = ({outcome}: {outcome?: string | null}) =>
  findChipConfig({catalog: FOLLOW_UP_TASK_OUTCOME, value: outcome});

export const getSourceConfig = ({source}: {source?: string | null}) =>
  findChipConfig({catalog: FOLLOW_UP_TASK_SOURCE, value: source});

// "Supervisory visit", the alert's flag type ("Red Flag") or "Standalone".
export const getSourceLabel = ({
  source,
  t,
}: {
  source?: FollowUpSource;
  t: TranslateFunction;
}): string => {
  if (source?.type === FOLLOW_UP_TASK_SOURCE.SUPERVISORY_VISIT.value)
    return t(FOLLOW_UP_TASK_SOURCE.SUPERVISORY_VISIT.labelKey);

  return source?.alert
    ? t(getAlertTypeLabelKey({alert: source.alert}))
    : t(FOLLOW_UP_TASK_SOURCE.STANDALONE.labelKey);
};

// Due dates render in the organization's zone when one is given; the time
// then carries the zone's short name ("17:00 EDT") so viewers elsewhere are
// not misled.
export const formatDueDate = ({
  dueAt,
  zone,
}: {
  dueAt?: string | null;
  zone?: string;
}): string =>
  formatIso({value: dueAt, format: FOLLOW_UP_DUE_FORMATS.date, zone});

export const formatDueTime = ({
  dueAt,
  zone,
}: {
  dueAt?: string | null;
  zone?: string;
}): string =>
  [
    formatIso({value: dueAt, format: FOLLOW_UP_DUE_FORMATS.time, zone}),
    formatZoneAbbreviation({value: dueAt, zone}),
  ]
    .filter(Boolean)
    .join(' ');

export const formatDueDateTime = ({
  dueAt,
  zone,
}: {
  dueAt?: string | null;
  zone?: string;
}): string =>
  [formatDueDate({dueAt, zone}), formatDueTime({dueAt, zone})]
    .filter(Boolean)
    .join(' · ');

// Minutes past due (positive = late). Falls back to the clock when the row
// carries no delta.
export const getLateMinutes = ({task}: {task: FollowUpTask}): number =>
  task.dueDeltaMinutes ?? -getMinutesUntil({value: task.dueAt});

// The quiet second line under a due date: "Today", "Tomorrow", "In 5 days",
// "2 days late", "Completed 3 days early".
export const getDueRelativeLabel = ({
  task,
  t,
  zone,
}: {
  task: FollowUpTask;
  t: TranslateFunction;
  zone?: string;
}): string => {
  if (task.status === FOLLOW_UP_TASK_STATUS.CANCELLED.value) return '';

  const minutes = getLateMinutes({task});
  const duration = formatDurationLabel({minutes, t});

  if (task.status === FOLLOW_UP_TASK_STATUS.COMPLETED.value)
    return minutes > 0
      ? t('followUps.due.completedLate', {duration})
      : t('followUps.due.completedEarly', {duration});

  if (minutes > 0) return t('followUps.due.late', {duration});

  if (!fromIso({value: task.dueAt})) return '';

  const days = Math.round(getDaysUntil({date: task.dueAt, zone}));

  if (days <= 0) return t('followUps.due.today');
  if (days === 1) return t('followUps.due.tomorrow');

  return t('followUps.due.inDays', {count: days});
};

// The form's date + "HH:mm", read in the organization's zone when given.
export const splitDueAt = ({
  dueAt,
  zone,
}: {
  dueAt?: string | null;
  zone?: string;
}): {dueDate: DateTime | null; dueTime: string} => {
  const parsed = fromIso({value: dueAt, zone});

  return {
    dueDate: parsed ? parsed.startOf('day') : null,
    dueTime: parsed ? parsed.toFormat(FOLLOW_UP_DUE_FORMATS.time) : '',
  };
};

// `supervisoryVisitId` links a task spawned from a visit back to it. The due
// clock time is read in `zone` (the organization's) when given.
export const buildFollowUpPayload = ({
  values,
  supervisoryVisitId,
  zone,
}: {
  values: FollowUpFormPayload;
  supervisoryVisitId?: string;
  zone?: string;
}): FollowUpTaskPayload =>
  Object.assign(
    {
      patientId: values.patientId,
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      visitInstructions: values.visitNotes?.trim() || undefined,
      assigneeUserOrganizationId: values.assigneeUserOrganizationId,
      priority: values.priority,
      dueAt:
        combineDateAndTime({
          date: values.dueDate,
          time: values.dueTime,
          zone,
        }) || '',
      checklistTemplateId: values.checklistTemplateId?.trim() || null,
    },
    supervisoryVisitId ? {supervisoryVisitId} : {}
  );

// The form keeps minutes only, so instants compare at minute precision.
const isSameMinute = ({a, b}: {a: string; b: string}): boolean =>
  Math.floor(getMillis({date: a}) / MS_PER_MINUTE) ===
  Math.floor(getMillis({date: b}) / MS_PER_MINUTE);

// Edit sends only what changed: an untouched past due date must not be
// re-validated as "in the future" when an overdue task is reassigned or renamed.
export const buildFollowUpUpdatePayload = ({
  values,
  task,
  zone,
}: {
  values: FollowUpFormPayload;
  task: FollowUpTask;
  zone?: string;
}): FollowUpTaskUpdatePayload => {
  const payload = buildFollowUpPayload({values, zone});

  const next: Required<FollowUpTaskUpdatePayload> = {
    title: payload.title,
    description: payload.description ?? null,
    visitInstructions: payload.visitInstructions ?? null,
    assigneeUserOrganizationId: payload.assigneeUserOrganizationId,
    priority: payload.priority,
    dueAt: payload.dueAt,
    checklistTemplateId: payload.checklistTemplateId ?? null,
  };

  const current: Required<FollowUpTaskUpdatePayload> = {
    title: task.title,
    description: task.description ?? null,
    visitInstructions: task.visitInstructions ?? null,
    assigneeUserOrganizationId: task.assigneeUserOrganizationId,
    priority: task.priority,
    dueAt: task.dueAt,
    checklistTemplateId: task.checklistTemplateId ?? null,
  };

  const changed: FollowUpTaskUpdatePayload = {};

  if (next.title !== current.title) changed.title = next.title;
  if (next.description !== current.description)
    changed.description = next.description;
  if (next.visitInstructions !== current.visitInstructions)
    changed.visitInstructions = next.visitInstructions;
  if (next.assigneeUserOrganizationId !== current.assigneeUserOrganizationId)
    changed.assigneeUserOrganizationId = next.assigneeUserOrganizationId;
  if (next.priority !== current.priority) changed.priority = next.priority;
  if (!isSameMinute({a: next.dueAt, b: current.dueAt}))
    changed.dueAt = next.dueAt;
  if (next.checklistTemplateId !== current.checklistTemplateId)
    changed.checklistTemplateId = next.checklistTemplateId;

  return changed;
};

const describeChangedFields = ({
  fields,
  t,
}: {
  fields: unknown;
  t: TranslateFunction;
}): string =>
  (Array.isArray(fields) ? fields : [])
    .map((field) => {
      const labelKey = FOLLOW_UP_EDITABLE_FIELD_LABEL_KEYS[String(field)];

      return labelKey ? t(labelKey) : String(field);
    })
    .join(', ');

const describeEvent = ({
  event,
  t,
}: {
  event: FollowUpEvent;
  t: TranslateFunction;
}): string => {
  const payload = event.payload || {};
  const eventTypes = FOLLOW_UP_TASK_EVENT_TYPES;

  switch (event.type) {
    case eventTypes.REASSIGNED.value:
    case eventTypes.ESCALATED_TO_ADMIN.value:
      return t('followUps.events.fromTo', {
        from: getAssigneeName({assignee: event.fromAssignee}),
        to: getAssigneeName({assignee: event.toAssignee}),
      });
    case eventTypes.EDITED.value:
      return t('followUps.events.changed', {
        fields: describeChangedFields({fields: payload.changedFields, t}),
      });
    case eventTypes.CANCELLED.value:
      return String(payload.reason || '');
    case eventTypes.COMPLETED.value:
      return t(
        getOutcomeConfig({outcome: String(payload.outcome || '')})?.labelKey ||
          ''
      );
    case eventTypes.REMINDER_SENT.value:
      return t('followUps.events.reminder', {
        hours: Math.round(
          Number(payload.offsetMinutes || 0) / MINUTES_PER_HOUR
        ),
      });
    case eventTypes.CREATED.value:
      if (payload.source === FOLLOW_UP_TASK_SOURCE.SUPERVISORY_VISIT.value)
        return t('followUps.events.fromSupervisoryVisit');

      return payload.source === FOLLOW_UP_TASK_SOURCE.ALERT.value
        ? t('followUps.events.fromAlert')
        : '';
    default:
      return '';
  }
};

export const mapEventToTimelineEntry = ({
  event,
  t,
  zone,
}: {
  event: FollowUpEvent;
  t: TranslateFunction;
  zone?: string;
}): ActivityLogEntry =>
  mapWorkItemEvent({
    event,
    eventTypes: FOLLOW_UP_TASK_EVENT_TYPES,
    describe: describeEvent,
    t,
    zone,
  });
