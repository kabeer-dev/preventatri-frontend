import {MINUTES_PER_HOUR} from '@/shared/constants/followUps';
import {
  SUPERVISORY_VISIT_EDITABLE_FIELD_LABEL_KEYS,
  SUPERVISORY_VISIT_EVENT_TYPES,
  SUPERVISORY_VISIT_FILING_COPY_KEYS,
  SUPERVISORY_VISIT_OUTCOME,
  SUPERVISORY_VISIT_SCHEDULE_FORMATS,
  SUPERVISORY_VISIT_SOURCE,
  SUPERVISORY_VISIT_STATUS,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import {ActivityLogEntry} from '@/shared/interfaces/activityTimeline';
import {
  SupervisoryVisit,
  SupervisoryVisitPayload,
  SupervisoryVisitSummary,
  SupervisoryVisitUpdatePayload,
} from '@/shared/interfaces/supervisoryVisit';
import {WorkItemEvent} from '@/shared/interfaces/workItem';
import {TranslateFunction} from '@/shared/types/common';
import {SupervisoryVisitFormPayload} from '@/shared/types/supervisoryVisit';
import {
  combineDateAndTime,
  DateTime,
  formatIso,
  formatZoneAbbreviation,
  fromIso,
  getDaysUntil,
  getMillis,
  getMinutesUntil,
  nowInZone,
} from '@/shared/utils/dateUtils';
import {
  findChipConfig,
  formatDurationLabel,
  getAssigneeName,
  mapEventToTimelineEntry,
} from '@/shared/utils/workItemUtils';

// Which filing copy the current user sees; mirrors the backend rule.
export const getFilingCopyKeys = ({isAdmin}: {isAdmin: boolean}) =>
  isAdmin
    ? SUPERVISORY_VISIT_FILING_COPY_KEYS.approvedOnFiling
    : SUPERVISORY_VISIT_FILING_COPY_KEYS.review;

export const getVisitStatusConfig = ({status}: {status?: string | null}) =>
  findChipConfig({catalog: SUPERVISORY_VISIT_STATUS, value: status});

export const getVisitTypeConfig = ({visitType}: {visitType?: string | null}) =>
  findChipConfig({catalog: SUPERVISORY_VISIT_TYPE, value: visitType});

export const getVisitOutcomeConfig = ({outcome}: {outcome?: string | null}) =>
  findChipConfig({catalog: SUPERVISORY_VISIT_OUTCOME, value: outcome});

// "Routine", "Triggered by alert" or the free text an OTHER visit carries.
export const getVisitTypeLabel = ({
  visit,
  t,
}: {
  visit: SupervisoryVisitSummary;
  t: TranslateFunction;
}): string => {
  if (visit.visitType === SUPERVISORY_VISIT_TYPE.OTHER.value)
    return visit.visitTypeOther || t(SUPERVISORY_VISIT_TYPE.OTHER.labelKey);

  const config = getVisitTypeConfig({visitType: visit.visitType});

  return config ? t(config.labelKey) : visit.visitType;
};

// Schedules render in the organization's zone when one is given; the window
// then carries the zone's short name ("09:00–10:30 EDT").
export const formatScheduleDate = ({
  value,
  zone,
}: {
  value?: string | null;
  zone?: string;
}): string =>
  formatIso({value, format: SUPERVISORY_VISIT_SCHEDULE_FORMATS.date, zone});

export const formatScheduleTime = ({
  value,
  zone,
}: {
  value?: string | null;
  zone?: string;
}): string =>
  formatIso({value, format: SUPERVISORY_VISIT_SCHEDULE_FORMATS.time, zone});

// "09:00–10:30" or "09:00–10:30 EDT"
export const formatScheduleWindow = ({
  visit,
  zone,
}: {
  visit: SupervisoryVisitSummary;
  zone?: string;
}): string =>
  [
    `${formatScheduleTime({value: visit.scheduledStartAt, zone})}–${formatScheduleTime({value: visit.scheduledEndAt, zone})}`,
    formatZoneAbbreviation({value: visit.scheduledStartAt, zone}),
  ]
    .filter(Boolean)
    .join(' ');

// "21 Aug 2026 · 09:00–10:30"
export const formatScheduleRange = ({
  visit,
  zone,
}: {
  visit: SupervisoryVisitSummary;
  zone?: string;
}): string =>
  [
    formatScheduleDate({value: visit.scheduledStartAt, zone}),
    formatScheduleWindow({visit, zone}),
  ]
    .filter(Boolean)
    .join(' · ');

// Minutes past the window (positive = late). Falls back to the clock when the
// row carries no delta.
export const getVisitLateMinutes = ({
  visit,
}: {
  visit: SupervisoryVisit;
}): number =>
  visit.scheduleDeltaMinutes ?? -getMinutesUntil({value: visit.scheduledEndAt});

// The quiet second line under a schedule: "Today", "In 5 days", "2 days
// late", "Filed 3 hours late".
export const getScheduleRelativeLabel = ({
  visit,
  t,
  zone,
}: {
  visit: SupervisoryVisit;
  t: TranslateFunction;
  zone?: string;
}): string => {
  if (visit.status === SUPERVISORY_VISIT_STATUS.CANCELLED.value) return '';

  const minutes = getVisitLateMinutes({visit});
  const duration = formatDurationLabel({minutes, t});

  if (visit.completedAt)
    return minutes > 0
      ? t('supervisoryVisits.schedule.filedLate', {duration})
      : t('supervisoryVisits.schedule.filedOnTime');

  if (minutes > 0) return t('followUps.due.late', {duration});

  if (!fromIso({value: visit.scheduledStartAt})) return '';

  const days = Math.round(getDaysUntil({date: visit.scheduledStartAt, zone}));

  if (days <= 0) return t('followUps.due.today');
  if (days === 1) return t('followUps.due.tomorrow');

  return t('followUps.due.inDays', {count: days});
};

// The form's date + "HH:mm" pair, read in the organization's zone when given.
export const splitSchedule = ({
  visit,
  zone,
}: {
  visit?: SupervisoryVisit | null;
  zone?: string;
}): {scheduledDate: DateTime | null; startTime: string; endTime: string} => {
  const start = fromIso({value: visit?.scheduledStartAt, zone});
  const end = fromIso({value: visit?.scheduledEndAt, zone});

  return {
    scheduledDate: start ? start.startOf('day') : null,
    startTime: start
      ? start.toFormat(SUPERVISORY_VISIT_SCHEDULE_FORMATS.time)
      : '',
    endTime: end ? end.toFormat(SUPERVISORY_VISIT_SCHEDULE_FORMATS.time) : '',
  };
};

// The window's clock times are read in `zone` (the organization's) when given.
export const buildSupervisoryVisitPayload = ({
  values,
  zone,
}: {
  values: SupervisoryVisitFormPayload;
  zone?: string;
}): SupervisoryVisitPayload => ({
  patientId: values.patientId,
  visitType: values.visitType,
  visitTypeOther:
    values.visitType === SUPERVISORY_VISIT_TYPE.OTHER.value
      ? values.visitTypeOther?.trim() || null
      : null,
  description: values.description?.trim() || undefined,
  assigneeUserOrganizationId: values.assigneeUserOrganizationId,
  checklistTemplateId: values.checklistTemplateId,
  scheduledStartAt:
    combineDateAndTime({
      date: values.scheduledDate,
      time: values.startTime,
      zone,
    }) || '',
  scheduledEndAt:
    combineDateAndTime({
      date: values.scheduledDate,
      time: values.endTime,
      zone,
    }) || '',
  caregiverUserOrganizationIds: values.caregiverUserOrganizationIds,
});

const MS_PER_MINUTE = 60 * 1000;

// The form keeps minutes only, so instants compare at minute precision.
const isSameMinute = ({a, b}: {a: string; b: string}): boolean =>
  Math.floor(getMillis({date: a}) / MS_PER_MINUTE) ===
  Math.floor(getMillis({date: b}) / MS_PER_MINUTE);

const isSameIdSet = ({a, b}: {a: string[]; b: string[]}): boolean =>
  JSON.stringify(Array.from(new Set(a)).sort()) ===
  JSON.stringify(Array.from(new Set(b)).sort());

// Edit sends only what changed: an untouched past window must not be
// re-validated as "in the future" when an overdue visit is reassigned.
export const buildSupervisoryVisitUpdatePayload = ({
  values,
  visit,
  zone,
}: {
  values: SupervisoryVisitFormPayload;
  visit: SupervisoryVisit;
  zone?: string;
}): SupervisoryVisitUpdatePayload => {
  const next = buildSupervisoryVisitPayload({values, zone});
  const changed: SupervisoryVisitUpdatePayload = {};

  if (next.visitType !== visit.visitType) changed.visitType = next.visitType;
  if ((next.visitTypeOther ?? null) !== (visit.visitTypeOther ?? null))
    changed.visitTypeOther = next.visitTypeOther ?? null;
  if ((next.description ?? null) !== (visit.description ?? null))
    changed.description = next.description ?? null;
  if (next.assigneeUserOrganizationId !== visit.assigneeUserOrganizationId)
    changed.assigneeUserOrganizationId = next.assigneeUserOrganizationId;
  if (next.checklistTemplateId !== visit.checklistTemplateId)
    changed.checklistTemplateId = next.checklistTemplateId;
  if (!isSameMinute({a: next.scheduledStartAt, b: visit.scheduledStartAt}))
    changed.scheduledStartAt = next.scheduledStartAt;
  if (!isSameMinute({a: next.scheduledEndAt, b: visit.scheduledEndAt}))
    changed.scheduledEndAt = next.scheduledEndAt;

  const currentCaregivers = (visit.caregivers || []).map(
    (entry) => entry.userOrgId
  );

  if (
    !isSameIdSet({a: next.caregiverUserOrganizationIds, b: currentCaregivers})
  )
    changed.caregiverUserOrganizationIds = next.caregiverUserOrganizationIds;

  return changed;
};

// The current week (Mon–Sun) in the organization's zone, as list params for
// the "Due this week" tab.
export const getWeekRangeParams = ({zone}: {zone?: string} = {}): {
  scheduledFrom: string;
  scheduledTo: string;
} => {
  const now = nowInZone({zone});

  return {
    scheduledFrom: now.startOf('week').toISO() || '',
    scheduledTo: now.endOf('week').toISO() || '',
  };
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
      const labelKey =
        SUPERVISORY_VISIT_EDITABLE_FIELD_LABEL_KEYS[String(field)];

      return labelKey ? t(labelKey) : String(field);
    })
    .join(', ');

export const describeVisitEvent = ({
  event,
  t,
}: {
  event: WorkItemEvent;
  t: TranslateFunction;
}): string => {
  const payload = event.payload || {};
  const eventTypes = SUPERVISORY_VISIT_EVENT_TYPES;

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
    case eventTypes.CORRECTION_REQUESTED.value:
      return String(payload.reason || '');
    case eventTypes.APPROVED.value:
      return payload.autoApproved
        ? t('supervisoryVisits.events.autoApproved')
        : String(payload.note || '');
    case eventTypes.FILED.value:
      return t(
        getVisitOutcomeConfig({outcome: String(payload.outcome || '')})
          ?.labelKey || ''
      );
    case eventTypes.REMINDER_SENT.value:
      return t('supervisoryVisits.events.reminder', {
        hours: Math.round(
          Number(payload.offsetMinutes || 0) / MINUTES_PER_HOUR
        ),
      });
    case eventTypes.FOLLOW_UPS_CREATED.value:
      return t('supervisoryVisits.events.tasksCount', {
        count: Array.isArray(payload.taskIds) ? payload.taskIds.length : 0,
      });
    case eventTypes.CREATED.value:
      return payload.source === SUPERVISORY_VISIT_SOURCE.ALERT.value
        ? t('followUps.events.fromAlert')
        : '';
    default:
      return '';
  }
};

export const mapVisitEventToTimelineEntry = ({
  event,
  t,
  zone,
}: {
  event: WorkItemEvent;
  t: TranslateFunction;
  zone?: string;
}): ActivityLogEntry =>
  mapEventToTimelineEntry({
    event,
    eventTypes: SUPERVISORY_VISIT_EVENT_TYPES,
    describe: describeVisitEvent,
    t,
    zone,
  });
