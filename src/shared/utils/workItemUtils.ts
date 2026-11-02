import {SYSTEM_ROLES} from '@/shared/constants/common';
import {
  FOLLOW_UP_DUE_FORMATS,
  MINUTES_PER_DAY,
  MINUTES_PER_HOUR,
} from '@/shared/constants/followUps';
import {ActivityLogEntry} from '@/shared/interfaces/activityTimeline';
import {Patient} from '@/shared/interfaces/patient';
import {
  ChipConfig,
  MapEventToTimelineEntryParams,
  WorkItemAlert,
  WorkItemAssignee,
  WorkItemPatient,
  WorkItemPerson,
} from '@/shared/interfaces/workItem';
import {TranslateFunction} from '@/shared/types/common';
import {formatIso} from '@/shared/utils/dateUtils';
import {getFullName} from '@/shared/utils/general';

// Helpers shared by follow-up tasks and supervisory visits.

export const flattenSections = <Q>({
  sections,
}: {
  sections: {questions: Q[]}[];
}): Q[] => sections.flatMap((s) => s.questions);

export const buildPatientFromWorkItem = ({
  patientId,
  patient,
}: {
  patientId: string;
  patient?: WorkItemPatient;
}): Patient => ({
  id: patientId,
  firstName: patient?.firstName || '',
  lastName: patient?.lastName || '',
  phoneNo: patient?.phoneNo ?? undefined,
  email: patient?.email ?? undefined,
  gender: patient?.gender ?? undefined,
  county: patient?.county?.id || '',
  countyName: patient?.county?.name || '',
  assignedRegionId: patient?.county?.region?.id || '',
  assignedRegion: patient?.county?.region?.name || '',
  status: '',
  dob: patient?.dateOfBirth || '',
  diagnosis: '',
  lastFlag: null,
});

export const getPersonName = ({
  person,
}: {
  person?: WorkItemPerson | null;
}): string =>
  person
    ? getFullName({firstName: person.firstName, lastName: person.lastName}) ||
      person.email ||
      ''
    : '';

export const getRoleLabel = ({role}: {role?: string | null}): string =>
  Object.values(SYSTEM_ROLES).find((entry) => entry.value === role)?.orgLabel ??
  (role || '');

export const getAssigneeName = ({
  assignee,
}: {
  assignee?: WorkItemAssignee | null;
}): string => getPersonName({person: assignee?.user});

// "Red Flag" / "Yellow Flag"; flags have no human-readable number to show.
export const getAlertTypeLabelKey = ({alert}: {alert: WorkItemAlert}): string =>
  `followUps.types.${alert.flag.toLowerCase()}`;

export const findChipConfig = <T extends ChipConfig>({
  catalog,
  value,
}: {
  catalog: Record<string, T>;
  value?: string | null;
}): T | undefined =>
  Object.values(catalog).find((entry) => entry.value === value);

export const formatHistoryTime = ({
  value,
  zone,
}: {
  value: string;
  zone?: string;
}): string => formatIso({value, format: FOLLOW_UP_DUE_FORMATS.history, zone});

// "3 days" / "6 hours" / "20 minutes" from a minute count.
export const formatDurationLabel = ({
  minutes,
  t,
}: {
  minutes: number;
  t: TranslateFunction;
}): string => {
  const absolute = Math.abs(minutes);

  if (absolute >= MINUTES_PER_DAY)
    return t('followUps.due.days', {
      count: Math.round(absolute / MINUTES_PER_DAY),
    });

  if (absolute >= MINUTES_PER_HOUR)
    return t('followUps.due.hours', {
      count: Math.round(absolute / MINUTES_PER_HOUR),
    });

  return t('followUps.due.minutes', {count: absolute});
};

export const mapEventToTimelineEntry = ({
  event,
  eventTypes,
  describe,
  t,
  zone,
}: MapEventToTimelineEntryParams): ActivityLogEntry => {
  const config = eventTypes[event.type];
  const detail = describe({event, t});
  const label = config ? t(config.labelKey) : event.type;
  const actorName = getPersonName({person: event.actor});

  return {
    id: event.id,
    title: detail ? `${label} — ${detail}` : label,
    timestamp: formatHistoryTime({value: event.createdAt, zone}),
    users: [{name: actorName || t('followUps.events.system')}],
    dotColor: config?.color ?? 'secondary',
  };
};

// Multipart body for the shared /complete endpoints: outcome, notes, evidence.
export const appendCompletionFormFields = ({
  formData,
  values,
  files,
  evidenceField,
}: {
  formData: FormData;
  values: {outcome: string; completionNotes: string};
  files: File[];
  evidenceField: string;
}): FormData => {
  formData.append('outcome', values.outcome);
  formData.append('completionNotes', values.completionNotes);
  files.forEach((file) => formData.append(evidenceField, file));

  return formData;
};
