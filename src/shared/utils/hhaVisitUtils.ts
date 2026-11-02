import {
  HHA_VISIT_DATE_FORMATS,
  HHA_VISIT_DATE_ONLY_ZONE,
  HHA_VISIT_EMPTY_VALUE,
  HHA_VISIT_STATUS,
  HHA_VISIT_TIME_ZONES,
  HHA_VISIT_TYPE,
  HHA_VISIT_WINDOW_SEPARATOR,
} from '@/shared/constants/hhaVisits';
import {
  HhaVisit,
  HhaVisitChip,
  HhaVisitDetailSection,
  HhaVisitDetailSectionsInput,
  HhaVisitInstant,
  HhaVisitNameParts,
  HhaVisitType,
  HhaVisitWindow,
} from '@/shared/interfaces/hhaVisit';
import {formatDate} from '@/shared/utils/dateUtils';

const MINUTES_PER_HOUR = 60;

/** "First Last" from the feed's name snapshot, or the empty marker. */
export const formatHhaVisitName = ({
  firstName,
  lastName,
}: HhaVisitNameParts): string =>
  [firstName, lastName].filter(Boolean).join(' ').trim() ||
  HHA_VISIT_EMPTY_VALUE;

/**
 * IANA zone for a visit's HHAeXchange TimeZone label, or undefined when the
 * label is absent or unknown. Undefined falls back to the browser's zone: the
 * sync anchored such clocks in its configured default zone, which the API
 * does not expose, so the viewer's zone is the only honest choice left.
 */
export const resolveHhaVisitZone = ({
  timeZone,
}: {
  timeZone: string | null;
}): string | undefined =>
  timeZone ? HHA_VISIT_TIME_ZONES[timeZone.trim().toLowerCase()] : undefined;

/** Calendar day of a date-only value; never shifted by the viewer's zone. */
export const formatHhaVisitDate = ({date}: {date: string | null}): string =>
  date
    ? formatDate({
        date,
        format: HHA_VISIT_DATE_FORMATS.DATE,
        zone: HHA_VISIT_DATE_ONLY_ZONE,
      })
    : HHA_VISIT_EMPTY_VALUE;

export const formatHhaVisitTime = ({
  date,
  timeZone,
}: HhaVisitInstant): string =>
  date
    ? formatDate({
        date,
        format: HHA_VISIT_DATE_FORMATS.TIME,
        zone: resolveHhaVisitZone({timeZone}),
      })
    : HHA_VISIT_EMPTY_VALUE;

export const formatHhaVisitDateTime = ({
  date,
  timeZone,
}: HhaVisitInstant): string =>
  date
    ? formatDate({
        date,
        format: HHA_VISIT_DATE_FORMATS.DATE_TIME,
        zone: resolveHhaVisitZone({timeZone}),
      })
    : HHA_VISIT_EMPTY_VALUE;

/**
 * "9:00 AM – 11:00 AM" for a start/end pair, in the visit's own zone. Only
 * the present half is shown while a visit is open ("9:07 AM" for a caregiver
 * who has clocked in but not out); the empty marker when neither exists.
 */
export const formatHhaVisitWindow = ({
  start,
  end,
  timeZone,
}: HhaVisitWindow): string =>
  [start, end]
    .filter(Boolean)
    .map((date) => formatHhaVisitTime({date, timeZone}))
    .join(HHA_VISIT_WINDOW_SEPARATOR) || HHA_VISIT_EMPTY_VALUE;

/** Minutes -> "2h 30m", or the empty marker. */
export const formatHhaVisitDuration = ({
  minutes,
}: {
  minutes: number | null;
}): string => {
  if (minutes === null || minutes === undefined) return HHA_VISIT_EMPTY_VALUE;

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainder = minutes % MINUTES_PER_HOUR;

  return (
    [hours ? `${hours}h` : '', remainder ? `${remainder}m` : '']
      .filter(Boolean)
      .join(' ') || `0m`
  );
};

/** Status -> chip label and colour. The API already returns UNCONFIRMED. */
export const resolveHhaVisitChip = ({
  visit,
  t,
}: {
  visit: HhaVisit;
  t: (key: string) => string;
}): HhaVisitChip => {
  const config =
    Object.values(HHA_VISIT_STATUS).find(
      (status) => status.value === visit.status
    ) ?? HHA_VISIT_STATUS.scheduled;

  return {label: t(config.labelKey), color: config.color};
};

const orEmpty = ({value}: {value: string | null}): string =>
  value || HHA_VISIT_EMPTY_VALUE;

/**
 * Visit type -> its translated label. The API returns the raw HhaVisitType
 * enum, so without this the table would read "DAILY_FIXED".
 *
 * Null is the normal case for a visit whose HHAeXchange VisitType the import
 * could not place, and it shows as the empty marker rather than a guess.
 */
export const formatHhaVisitType = ({
  visitType,
  t,
}: {
  visitType: HhaVisitType | null;
  t: (key: string) => string;
}): string => {
  const config = Object.values(HHA_VISIT_TYPE).find(
    (option) => option.value === visitType
  );

  return config ? t(config.labelKey) : HHA_VISIT_EMPTY_VALUE;
};

/**
 * The detail dialog's sections, as plain strings so the modal only lays them
 * out. "Schedule" is the planned half of the HHAeXchange record and "Visit Time"
 * the actual/EVV half; the conditional sections appear only when the feed
 * reported a missed or deleted visit.
 */
export const buildHhaVisitDetailSections = ({
  visit,
  t,
}: HhaVisitDetailSectionsInput): HhaVisitDetailSection[] => {
  const labels = ({key}: {key: string}) => t(`hhaVisits.detail.labels.${key}`);

  const sections: HhaVisitDetailSection[] = [
    {
      title: t('hhaVisits.detail.sections.visit'),
      rows: [
        {
          label: labels({key: 'patient'}),
          value: formatHhaVisitName({
            firstName: visit.patientFirstName,
            lastName: visit.patientLastName,
          }),
        },
        {
          label: labels({key: 'caregiver'}),
          value: formatHhaVisitName({
            firstName: visit.caregiverFirstName,
            lastName: visit.caregiverLastName,
          }),
        },
        {
          label: labels({key: 'visitDate'}),
          value: formatHhaVisitDate({date: visit.visitDate}),
        },
        {
          label: labels({key: 'visitType'}),
          value: formatHhaVisitType({visitType: visit.visitType, t}),
        },
      ],
    },
    {
      title: t('hhaVisits.detail.sections.schedule'),
      rows: [
        {
          label: labels({key: 'scheduledStart'}),
          value: formatHhaVisitDateTime({
            date: visit.scheduledStartAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'scheduledEnd'}),
          value: formatHhaVisitDateTime({
            date: visit.scheduledEndAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'duration'}),
          value: formatHhaVisitDuration({
            minutes: visit.scheduleDurationMinutes,
          }),
        },
        {
          label: labels({key: 'timeZone'}),
          value: orEmpty({value: visit.timeZone}),
        },
      ],
    },
    {
      title: t('hhaVisits.detail.sections.visitTime'),
      rows: [
        {
          label: labels({key: 'actualStart'}),
          value: formatHhaVisitDateTime({
            date: visit.actualStartAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'actualEnd'}),
          value: formatHhaVisitDateTime({
            date: visit.actualEndAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'evvStart'}),
          value: formatHhaVisitDateTime({
            date: visit.evvStartAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'evvEnd'}),
          value: formatHhaVisitDateTime({
            date: visit.evvEndAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'clockIn'}),
          value: orEmpty({value: visit.clockInEvvType}),
        },
        {
          label: labels({key: 'clockOut'}),
          value: orEmpty({value: visit.clockOutEvvType}),
        },
      ],
    },
  ];

  if (visit.isMissedVisit) {
    sections.push({
      title: t('hhaVisits.detail.sections.missed'),
      rows: [
        {
          label: labels({key: 'missedReason'}),
          value:
            visit.missedReason ||
            (visit.missedReasonId !== null
              ? String(visit.missedReasonId)
              : HHA_VISIT_EMPTY_VALUE),
        },
      ],
    });
  }

  if (visit.status === HHA_VISIT_STATUS.deleted.value) {
    sections.push({
      title: t('hhaVisits.detail.sections.deleted'),
      rows: [
        {
          label: labels({key: 'deletedAt'}),
          value: formatHhaVisitDateTime({
            date: visit.hhaDeletedAt,
            timeZone: visit.timeZone,
          }),
        },
        {
          label: labels({key: 'deletedReason'}),
          value: orEmpty({value: visit.hhaDeletedReason}),
        },
      ],
    });
  }

  sections.push({
    title: t('hhaVisits.detail.sections.sync'),
    rows: [
      {
        label: labels({key: 'hhaModifiedDate'}),
        value: formatHhaVisitDateTime({
          date: visit.hhaModifiedDate,
          timeZone: visit.timeZone,
        }),
      },
      {
        label: labels({key: 'hhaLastSyncedAt'}),
        value: formatHhaVisitDateTime({
          date: visit.hhaLastSyncedAt,
          timeZone: visit.timeZone,
        }),
      },
    ],
  });

  return sections;
};
