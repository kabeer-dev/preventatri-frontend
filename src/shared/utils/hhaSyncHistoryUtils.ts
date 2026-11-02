import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {
  HHA_COORDINATOR_STATUS,
  HHA_SYNC_DATE_FORMAT,
  HHA_SYNC_DATE_ONLY_ZONE,
  HHA_SYNC_DATE_TIME_FORMAT,
  HHA_SYNC_ISO_DATE_TIME,
  HHA_SYNC_UTC_MIDNIGHT_SUFFIX,
  HHA_SYNC_EXCEPTION_TYPES,
  HHA_SYNC_FIELD_LABEL_KEYS,
  HHA_SYNC_RESOURCE_OUTCOME,
  HHA_SYNC_RESOURCE_TIMELINE,
  HHA_SYNC_RESOURCES,
  HHA_SYNC_RUN_STATUS,
  HHA_SYNC_TIMELINE_DOT,
  HHA_SYNC_UNKNOWN_EXCEPTION_TYPE,
} from '@/shared/constants/hhaSyncHistory';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {ActivityLogEntry} from '@/shared/interfaces/activityTimeline';
import {
  HhaPatientCoordinator,
  HhaSyncChip,
  HhaSyncExceptionTypeMeta,
  HhaSyncFormatChangeValueInput,
  HhaSyncLinkedRecord,
  HhaSyncResourceSummary,
  HhaSyncRun,
  HhaSyncTranslate as Translate,
} from '@/shared/interfaces/hhaSyncHistory';
import {DateTime, formatIso} from '@/shared/utils/dateUtils';

/** Label and colour of a raw API value, or the raw value on a neutral chip. */
export const resolveSyncChip = ({
  map,
  value,
  t,
}: {
  map: Record<string, HhaSyncChip>;
  value: string;
  t: Translate;
}): {label: string; color: HhaSyncChip['color']} => {
  const chip = map[value];

  return chip
    ? {label: t(chip.labelKey), color: chip.color}
    : {label: value, color: 'secondary'};
};

/** What one HHAeXchange coordinator of a patient is here; null = nothing to flag. */
export const resolveCoordinatorStatus = ({
  coordinator,
  t,
}: {
  coordinator: HhaPatientCoordinator;
  t: Translate;
}): {label: string; color: HhaSyncChip['color']} | null => {
  const key =
    (coordinator.isCaseManager && 'caseManager') ||
    (!coordinator.caseManagerProfileId && 'notSynced') ||
    (coordinator.isArchived && 'archived') ||
    (!coordinator.isActive && 'notActive') ||
    null;

  return key
    ? resolveSyncChip({map: HHA_COORDINATOR_STATUS, value: key, t})
    : null;
};

export const formatSyncDateTime = ({
  value,
  zone,
}: {
  value: string | null | undefined;
  zone: string | undefined;
}): string =>
  formatIso({value, format: HHA_SYNC_DATE_TIME_FORMAT, zone}) ||
  DETAIL_EMPTY_VALUE;

/** "4m 12s"; the empty marker while a run is still going. */
export const formatSyncDuration = ({
  startedAt,
  finishedAt,
}: {
  startedAt: string | null;
  finishedAt: string | null;
}): string => {
  if (!startedAt || !finishedAt) return DETAIL_EMPTY_VALUE;

  const duration = DateTime.fromISO(finishedAt)
    .diff(DateTime.fromISO(startedAt), ['hours', 'minutes', 'seconds'])
    .toObject();

  const parts = [
    duration.hours ? `${duration.hours}h` : '',
    duration.minutes ? `${duration.minutes}m` : '',
    `${Math.round(duration.seconds || 0)}s`,
  ];

  return parts.filter(Boolean).join(' ');
};

export const resolveResourceLabel = ({
  resource,
  t,
}: {
  resource: string;
  t: Translate;
}): string => {
  const key = HHA_SYNC_RESOURCES[resource as keyof typeof HHA_SYNC_RESOURCES];

  return key ? t(key) : resource;
};

/** Created / updated / exception totals across a run's resources. */
export const sumRunCounters = ({run}: {run: HhaSyncRun}) =>
  Object.values(run.summaries || {}).reduce(
    (totals, summary) => ({
      created: totals.created + (summary.created || 0),
      updated: totals.updated + (summary.updated || 0),
      exceptions: totals.exceptions + (summary.exceptionCount || 0),
    }),
    {created: 0, updated: 0, exceptions: 0}
  );

export const resolveFieldLabel = ({
  field,
  t,
}: {
  field: string;
  t: Translate;
}): string =>
  HHA_SYNC_FIELD_LABEL_KEYS[field]
    ? t(HHA_SYNC_FIELD_LABEL_KEYS[field])
    : field;

/**
 * A change value for display: the name behind a link id, a readable date for
 * an ISO value (date-only values are stored as UTC midnight), else the value.
 */
export const formatChangeValue = ({
  value,
  label,
  t,
  zone,
}: HhaSyncFormatChangeValueInput & {t: Translate}): string => {
  if (value === null || value === undefined || value === '') {
    return t('hhaSyncHistory.fields.none');
  }

  if (label) return label;

  const text = String(value);

  if (!HHA_SYNC_ISO_DATE_TIME.test(text)) return text;

  return text.endsWith(HHA_SYNC_UTC_MIDNIGHT_SUFFIX)
    ? formatIso({
        value: text,
        format: HHA_SYNC_DATE_FORMAT,
        zone: HHA_SYNC_DATE_ONLY_ZONE,
      })
    : formatSyncDateTime({value: text, zone});
};

export const getExceptionTypeMeta = ({
  type,
}: {
  type: string;
}): HhaSyncExceptionTypeMeta =>
  HHA_SYNC_EXCEPTION_TYPES[type] || HHA_SYNC_UNKNOWN_EXCEPTION_TYPE;

/** Title, what happened and what to do, for one exception code. */
export const getExceptionCopy = ({type, t}: {type: string; t: Translate}) => {
  const base = HHA_SYNC_EXCEPTION_TYPES[type]
    ? `hhaSyncHistory.exceptionTypes.${type}`
    : 'hhaSyncHistory.unknownType';

  return {
    title: t(`${base}.title`),
    happened: t(`${base}.happened`),
    action: t(`${base}.action`),
  };
};

const RECORD_ROUTES: Record<string, ((args: {id: string}) => string) | null> = {
  patient: DASHBOARD_ROUTES.patients.single,
  nurse: DASHBOARD_ROUTES.nurses.single,
  caregiver: DASHBOARD_ROUTES.caregivers.single,
  caseManager: DASHBOARD_ROUTES.caseManagers.single,
  user: () => DASHBOARD_ROUTES.users.all(),
  visit: () => DASHBOARD_ROUTES.hhaVisits.all(),
};

/** The page a linked record opens, or null when it has none. */
export const resolveRecordHref = ({
  record,
}: {
  record: Pick<HhaSyncLinkedRecord, 'kind' | 'id'> | null;
}): string | null => {
  if (!record) return null;

  const route = RECORD_ROUTES[record.kind];

  return route ? route({id: record.id}) : null;
};

/** A finished resource with a blocking exception is not "Succeeded". */
export const resolveResourceOutcome = ({
  summary,
}: {
  summary: HhaSyncResourceSummary;
}): string => {
  if (!summary.succeeded) return HHA_SYNC_RESOURCE_OUTCOME.failed;

  return (summary.blockingCount || 0) > 0
    ? HHA_SYNC_RESOURCE_OUTCOME.withExceptions
    : HHA_SYNC_RESOURCE_OUTCOME.succeeded;
};

const RUN_ORDER = Object.keys(HHA_SYNC_RESOURCES);

/** A run's resource summaries in run order (stored JSON does not keep it). */
export const orderRunSummaries = ({run}: {run: HhaSyncRun}) =>
  Object.values(run.summaries || {}).sort(
    (first, second) =>
      RUN_ORDER.indexOf(first.resource) - RUN_ORDER.indexOf(second.resource)
  );

/** Start, each resource in run order, then the finish, as timeline entries. */
export const buildRunTimeline = ({
  run,
  t,
  zone,
}: {
  run: HhaSyncRun;
  t: Translate;
  zone: string | undefined;
}): ActivityLogEntry[] => {
  const actor = {
    name: run.requestedBy?.name || t('hhaSyncHistory.runs.detail.auto'),
  };

  const resourceEntries = orderRunSummaries({run}).map(
    (summary): ActivityLogEntry => {
      const resource = resolveResourceLabel({resource: summary.resource, t});

      const entry =
        HHA_SYNC_RESOURCE_TIMELINE[resolveResourceOutcome({summary})];

      return {
        id: summary.resource,
        title: t(entry.titleKey, {resource}),
        timestamp: formatSyncDateTime({value: summary.finishedAt, zone}),
        users: [actor],
        dotColor: entry.dotColor,
      };
    }
  );

  const finished: ActivityLogEntry = {
    id: 'finished',
    title: run.finishedAt
      ? t('hhaSyncHistory.runs.detail.finished')
      : t('hhaSyncHistory.runs.detail.notFinished'),
    timestamp: formatSyncDateTime({value: run.finishedAt, zone}),
    users: [actor],
    dotColor: resolveSyncChip({map: HHA_SYNC_RUN_STATUS, value: run.status, t})
      .color,
  };

  return [
    {
      id: 'started',
      title: t('hhaSyncHistory.runs.detail.started'),
      timestamp: formatSyncDateTime({value: run.startedAt, zone}),
      users: [actor],
      dotColor: HHA_SYNC_TIMELINE_DOT.start,
    },
  ]
    .concat(resourceEntries)
    .concat([finished]);
};
