import {ThemeColor} from '@/@core/theme/types';
import {DATE_ONLY_ZONE} from '@/shared/constants/common';

/**
 * HhaVisit.status as the API returns it (raw HhaVisitStatus enum), with the
 * label key and chip colour resolved here -- the backend never computes
 * presentation. Keys mirror HHA_VISIT_STATUSES on the backend.
 */
export const HHA_VISIT_STATUS = {
  scheduled: {
    value: 'SCHEDULED',
    labelKey: 'hhaVisits.statuses.scheduled',
    color: 'info' as ThemeColor,
  },
  inProgress: {
    value: 'IN_PROGRESS',
    labelKey: 'hhaVisits.statuses.inProgress',
    color: 'primary' as ThemeColor,
  },

  // Derived by the API on read (HHA's "Incomplete Confirmation"), never stored.
  unconfirmed: {
    value: 'UNCONFIRMED',
    labelKey: 'hhaVisits.statuses.unconfirmed',
    color: 'warning' as ThemeColor,
  },
  completed: {
    value: 'COMPLETED',
    labelKey: 'hhaVisits.statuses.completed',
    color: 'success' as ThemeColor,
  },
  missed: {
    value: 'MISSED',
    labelKey: 'hhaVisits.statuses.missed',
    color: 'error' as ThemeColor,
  },
  deleted: {
    value: 'DELETED',
    labelKey: 'hhaVisits.statuses.deleted',
    color: 'secondary' as ThemeColor,
  },
} as const;

/**
 * HhaVisit.visitType as the API returns it (raw HhaVisitType enum). These are
 * the four options HHAeXchange itself offers when a schedule is created, and
 * they say how the visit was SCHEDULED rather than what happened on it.
 *
 * The field is nullable: HHAeXchange documents no fixed list for it, so the
 * import stores null for a value it could not place, and the page shows the
 * empty marker for those rather than inventing a label.
 */
export const HHA_VISIT_TYPE = {
  dailyFixed: {
    value: 'DAILY_FIXED',
    labelKey: 'hhaVisits.visitTypes.dailyFixed',
  },
  dailyVariable: {
    value: 'DAILY_VARIABLE',
    labelKey: 'hhaVisits.visitTypes.dailyVariable',
  },
  weeklyVariable: {
    value: 'WEEKLY_VARIABLE',
    labelKey: 'hhaVisits.visitTypes.weeklyVariable',
  },
  noSchedule: {
    value: 'NO_SCHEDULE',
    labelKey: 'hhaVisits.visitTypes.noSchedule',
  },
} as const;

/** Luxon tokens for the visit columns and detail dialog. */
export const HHA_VISIT_DATE_FORMATS = {
  DATE: 'dd MMM yyyy',
  TIME: 'h:mm a',
  DATE_TIME: 'dd MMM yyyy, h:mm a',
} as const;

/**
 * HHAeXchange TimeZone labels -> IANA zones, keyed lowercase. Mirrors the
 * backend's HHAX_TIMEZONE_MAP. Visit clock times are stored as UTC instants
 * anchored in this zone, so they are rendered back in it: a 9:00 AM Eastern
 * visit reads 9:00 AM for every admin, whatever zone their browser is in.
 */
export const HHA_VISIT_TIME_ZONES: Record<string, string> = {
  eastern: 'America/New_York',
  est: 'America/New_York',
  edt: 'America/New_York',
  et: 'America/New_York',
  central: 'America/Chicago',
  cst: 'America/Chicago',
  cdt: 'America/Chicago',
  ct: 'America/Chicago',
  mountain: 'America/Denver',
  mst: 'America/Denver',
  mdt: 'America/Denver',
  mt: 'America/Denver',
  pacific: 'America/Los_Angeles',
  pst: 'America/Los_Angeles',
  pdt: 'America/Los_Angeles',
  pt: 'America/Los_Angeles',
  arizona: 'America/Phoenix',
  alaska: 'America/Anchorage',
  akst: 'America/Anchorage',
  akdt: 'America/Anchorage',
  hawaii: 'Pacific/Honolulu',
  hst: 'Pacific/Honolulu',
  atlantic: 'America/Puerto_Rico',
  ast: 'America/Puerto_Rico',
  utc: 'UTC',
  gmt: 'UTC',
};

/**
 * visitDate is a date-only column that the API serializes as UTC midnight;
 * formatting it in UTC keeps the calendar day intact for viewers west of UTC.
 */
export const HHA_VISIT_DATE_ONLY_ZONE = DATE_ONLY_ZONE;

/** Rendered when a time or name the feed can leave blank is absent. */
export const HHA_VISIT_EMPTY_VALUE = 'N/A';

/** Joins the start and end of a scheduled / visit time window. */
export const HHA_VISIT_WINDOW_SEPARATOR = ' – ';

/** Sort fields the list endpoint accepts (mirrors HHA_VISIT_SORT_FIELDS). */
export const HHA_VISIT_SORT_FIELDS = {
  visitDate: 'visitDate',
  scheduledStartAt: 'scheduledStartAt',
  status: 'status',
  patientLastName: 'patientLastName',
  caregiverLastName: 'caregiverLastName',
  hhaModifiedDate: 'hhaModifiedDate',
} as const;

/** Default list order: newest visit day first. */
export const HHA_VISIT_DEFAULT_SORT = {
  sortBy: HHA_VISIT_SORT_FIELDS.visitDate,
  sortDir: 'desc',
} as const;
