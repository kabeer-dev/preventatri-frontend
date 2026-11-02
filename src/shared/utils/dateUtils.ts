import {DateTime} from 'luxon';

import {DATE_FORMATS} from '@/shared/constants/common';
import {DAYS_ORDER} from '@/shared/constants/settings';
import type {
  DayGroup,
  FormatDurationLabelParams,
} from '@/shared/interfaces/utils';
import {DayOfWeek} from '@/shared/types/settings';

const toDateTime = ({value}: {value: unknown}) => {
  if (!value) return null;
  if (DateTime.isDateTime(value)) return value.startOf('day');
  if (value instanceof Date) return DateTime.fromJSDate(value).startOf('day');
  if (typeof value === 'string') {
    const dt = DateTime.fromISO(value);

    return dt.isValid ? dt.startOf('day') : null;
  }

  return null;
};

// Function to get the current date and time
function getCurrentDateTime(): string {
  return DateTime.now().toISO();
}

function getCurrentDate(): Date {
  return DateTime.now().toJSDate();
}

// Formats an ISO timestamp. Without `zone` the browser's local zone is used;
// pass an IANA zone (or 'utc') to render the instant in that zone instead,
// e.g. a date-only column serialized as UTC midnight, or a visit whose clock
// times belong to the agency's zone rather than the viewer's.
function formatDate({
  date,
  format = 'yyyy-MM-dd',
  zone,
}: {
  date: string;
  format?: string;
  zone?: string;
}): string {
  // The zone is given at parse time so an offset-less string is read in that
  // zone too, instead of in the browser zone and then shifted.
  return DateTime.fromISO(date, zone ? {zone} : undefined).toFormat(format);
}
function isValidDate({date}: {date: string}): boolean {
  return DateTime.fromISO(date).isValid;
}

const getFutureDate = ({days = 30, format = 'utcString'}): Date | string => {
  const futureDate = DateTime.now().plus({days});

  switch (format) {
    case 'jsDate':
      return futureDate.toJSDate();
    case 'iso':
      return futureDate.toISO()!;
    case 'utcString':
    default:
      return futureDate.toUTC().toHTTP();
  }
};

const formatToMinutesSeconds = ({seconds}: {seconds: number}) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const calculateSecondsLeft = ({expiryTime}: {expiryTime: number}) => {
  return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
};

// Seconds remaining until an ISO timestamp, clamped at 0. Reuses
// calculateSecondsLeft by converting the ISO string to epoch millis.
const secondsUntilIso = ({iso}: {iso: string}): number => {
  const dt = DateTime.fromISO(iso);

  if (!dt.isValid) return 0;

  return calculateSecondsLeft({expiryTime: dt.toMillis()});
};

const secondsSinceIso = ({iso}: {iso: string}): number => {
  const dt = DateTime.fromISO(iso);

  if (!dt.isValid) return 0;

  return Math.max(0, Math.floor((Date.now() - dt.toMillis()) / 1000));
};

const secondsBetweenIso = ({from, to}: {from: string; to: string}): number => {
  const start = DateTime.fromISO(from);
  const end = DateTime.fromISO(to);

  if (!start.isValid || !end.isValid) return 0;

  return Math.max(0, Math.floor((end.toMillis() - start.toMillis()) / 1000));
};

const pad = ({value}: {value: number}): string =>
  value < 10 ? `0${value}` : `${value}`;

const formatElapsed = ({seconds}: {seconds: number}): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  const minutesAndSeconds = `${pad({value: minutes})}:${pad({value: secs})}`;

  if (days > 0) return `${days}d ${pad({value: hours})}:${minutesAndSeconds}`;

  if (hours > 0) return `${pad({value: hours})}:${minutesAndSeconds}`;

  return minutesAndSeconds;
};

// Human countdown for a remaining duration. Delegates to
// formatToMinutesSeconds for the sub-hour tail and only surfaces hours/days
// when the window is actually that long, so a typical minutes-long SLA stays
// compact (e.g. "04:32") while longer windows still read correctly.
const formatCountdown = ({seconds}: {seconds: number}): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (days > 0) {
    return `${days}d ${pad({value: hours})}:${pad({value: minutes})}:${pad({value: secs})}`;
  }

  if (hours > 0) {
    return `${pad({value: hours})}:${pad({value: minutes})}:${pad({value: secs})}`;
  }

  return formatToMinutesSeconds({seconds: safeSeconds});
};

// Two largest units only ("45m", "2h 5m", "1d 3h"), for tight table cells.
const formatShortDuration = ({seconds}: {seconds: number}): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;

  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

  if (minutes > 0) return `${minutes}m`;

  return `${safeSeconds}s`;
};

const formatDurationLabel = ({
  seconds,
  labels,
}: FormatDurationLabelParams): string => {
  if (seconds === null) return labels.noExpiry;

  const totalMinutes = Math.max(0, Math.floor(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [
    hours > 0 ? `${hours} ${hours === 1 ? labels.hour : labels.hours}` : '',
    minutes > 0
      ? `${minutes} ${minutes === 1 ? labels.minute : labels.minutes}`
      : '',
  ].filter(Boolean);

  return parts.join(' ') || `0 ${labels.minutes}`;
};

// The current instant, read in `zone` when given (an organization's zone) and
// in the browser zone otherwise.
const nowInZone = ({zone}: {zone?: string}) =>
  zone ? DateTime.now().setZone(zone) : DateTime.now();

// Calendar days from today until `date`, both taken in `zone` when given.
const getDaysUntil = ({date, zone}: {date: string; zone?: string}): number => {
  const now = nowInZone({zone}).startOf('day');

  const target = DateTime.fromISO(date, zone ? {zone} : undefined).startOf(
    'day'
  );

  return target.diff(now, 'days').days;
};

const isFutureDate = ({date}: {date: string}): boolean => {
  const parsed = DateTime.fromISO(date);
  const dueDay = DateTime.local(parsed.year, parsed.month, parsed.day);
  const today = DateTime.local().startOf('day');

  return dueDay > today;
};

/**
 * Returns today at midnight as a Luxon DateTime, in `zone` when given.
 * Useful for date picker min/max constraints.
 */
const getToday = ({zone}: {zone?: string} = {}) =>
  nowInZone({zone}).startOf('day');

const formatTimeOfDay = ({millis}: {millis?: number}): string =>
  millis ? DateTime.fromMillis(millis).toFormat(DATE_FORMATS.time) : '';

const formatMillis = ({
  millis,
  format,
}: {
  millis?: number;
  format: string;
}): string => (millis ? DateTime.fromMillis(millis).toFormat(format) : '');

// Today's day-of-week key ('monday', 'tuesday', ...). Without `zone` this is
// the viewer's local day; pass an IANA zone to get the day in that zone
// instead, e.g. an organization's configured time zone.
const getTodayDayKey = ({zone}: {zone?: string} = {}): DayOfWeek =>
  DAYS_ORDER[
    (zone ? DateTime.now().setZone(zone) : DateTime.now()).weekday - 1
  ];

// The three day predicates answer no for a missing or unreadable value, so a
// record with no date is never counted as due, late or today's.
const isTodayOrFuture = ({value}: {value: unknown}): boolean => {
  const date = toDateTime({value});

  if (!date) return false;

  return date >= getToday();
};

const isBeforeToday = ({value}: {value: unknown}): boolean => {
  const date = toDateTime({value});

  if (!date) return false;

  return date < getToday();
};

const isToday = ({value}: {value: unknown}): boolean => {
  const date = toDateTime({value});

  if (!date) return false;

  return date.hasSame(getToday(), 'day');
};

/**
 * Cuts a list into days, keeping the list's own order. Items whose date does
 * not parse are dropped. `labelDay` names each group from its first item's
 * date, so a caller can say "Today" or "18 Aug" as it likes.
 */
const groupByDay = <T>({
  items,
  getDate,
  labelDay,
}: {
  items: T[];
  getDate: ({item}: {item: T}) => string;
  labelDay: ({date}: {date: string}) => string;
}): DayGroup<T>[] => {
  const groups: DayGroup<T>[] = [];

  items.forEach((item) => {
    const date = getDate({item});
    const key = toDateOnlyString({value: date});

    if (!key) return;

    const existing = groups.find((group) => group.key === key);

    if (existing) {
      existing.items.push(item);

      return;
    }

    groups.push({key, label: labelDay({date}), items: [item]});
  });

  return groups;
};

// Whole years between a date of birth and today. Null for a missing, unusable
// or future date, so a row shows the rest of its identity line rather than a
// nonsense age.
const getAgeInYears = ({dob}: {dob?: string}): number | null => {
  if (!dob) return null;

  const birth = DateTime.fromISO(dob);

  if (!birth.isValid) return null;

  const years = Math.floor(DateTime.now().diff(birth, 'years').years);

  return years < 0 ? null : years;
};

/**
 * Returns a trailing date-only range ending today: { from: today - days,
 * to: today } as 'yyyy-MM-dd' strings. Used by the dashboard statistics graph
 * presets so the frontend default matches the backend's trailing-window default.
 */
const getPastDateRange = ({
  days,
}: {
  days: number;
}): {from: string; to: string} => {
  const today = getToday();

  return {
    from: today.minus({days}).toISODate() ?? '',
    to: today.toISODate() ?? '',
  };
};

// Calendar days from `from` to `to`, both counted. Null when either day is
// unreadable or `to` is before `from`.
const getInclusiveDayCount = ({
  from,
  to,
}: {
  from: string;
  to: string;
}): number | null => {
  const start = DateTime.fromISO(from);
  const end = DateTime.fromISO(to);

  if (!start.isValid || !end.isValid || end < start) return null;

  return Math.round(end.diff(start, 'days').days) + 1;
};

const formatDateRangeLabel = ({
  range,
  sameYearStartFormat,
  fullFormat,
}: {
  range: {from?: string; to?: string};
  sameYearStartFormat: string;
  fullFormat: string;
}): string => {
  if (!range.from || !range.to) return '';

  const from = DateTime.fromISO(range.from);
  const to = DateTime.fromISO(range.to);

  if (!from.isValid || !to.isValid) return '';

  const startFormat = from.year === to.year ? sameYearStartFormat : fullFormat;

  return `${from.toFormat(startFormat)} – ${to.toFormat(fullFormat)}`;
};

const toIsoString = ({value}: {value: unknown}): string | null => {
  if (!value) return null;
  if (DateTime.isDateTime(value)) return value.toISO();
  if (value instanceof Date) return DateTime.fromJSDate(value).toISO();
  if (typeof value === 'string') {
    const dt = DateTime.fromISO(value);

    return dt.isValid ? dt.toISO() : null;
  }

  return null;
};

// Formats a date-like value to a calendar-date string ('yyyy-MM-dd'), dropping
// the time/zone. Used for date-range filter params so the backend receives the
// day the user picked (not a zone-shifted instant).
const toDateOnlyString = ({value}: {value: unknown}): string | null => {
  if (!value) return null;
  if (DateTime.isDateTime(value)) return value.toISODate();
  if (value instanceof Date) return DateTime.fromJSDate(value).toISODate();
  if (typeof value === 'string') {
    const dt = DateTime.fromISO(value);

    return dt.isValid ? dt.toISODate() : null;
  }

  return null;
};

// Parses an ISO instant; read in `zone` when given so its clock fields (day,
// hour) belong to that zone rather than the browser's.
const fromIso = ({
  value,
  zone,
}: {
  value: string | null | undefined;
  zone?: string;
}) => {
  if (!value) return null;
  const dt = DateTime.fromISO(value, zone ? {zone} : undefined);

  return dt.isValid ? dt : null;
};

const getMillis = ({date}: {date: string}): number => {
  const parsed = DateTime.fromISO(date);

  return parsed.isValid ? parsed.toMillis() : Number.NEGATIVE_INFINITY;
};

// Human-friendly relative time (e.g. "3 hours ago") from an ISO timestamp.
// Reuses fromIso and returns '' when the value is missing or unparseable.
const getRelativeTimeFromIso = ({
  value,
}: {
  value: string | null | undefined;
}): string => {
  const dt = fromIso({value});

  return dt?.toRelative() ?? '';
};

// One instant from a calendar day plus a wall-clock "HH:mm", read in `zone`
// when given (the browser's zone otherwise), as a UTC ISO string. Null when
// either part is unreadable.
const combineDateAndTime = ({
  date,
  time,
  zone,
}: {
  date: unknown;
  time: string;
  zone?: string;
}): string | null => {
  const day = toDateTime({value: date});
  const [hour, minute] = (time || '').split(':').map(Number);

  if (!day || Number.isNaN(hour) || Number.isNaN(minute)) return null;

  const combined = DateTime.fromObject(
    {
      year: day.year,
      month: day.month,
      day: day.day,
      hour,
      minute,
    },
    zone ? {zone} : undefined
  );

  return combined.isValid ? combined.toUTC().toISO() : null;
};

// Like formatDate, but '' for a missing or unparseable value. Rendered in
// `zone` when given.
const formatIso = ({
  value,
  format,
  zone,
}: {
  value: string | null | undefined;
  format: string;
  zone?: string;
}): string => fromIso({value, zone})?.toFormat(format) ?? '';

// Short zone name of an instant in `zone` ("EDT"); '' without a zone, since
// the browser zone needs no label.
const formatZoneAbbreviation = ({
  value,
  zone,
}: {
  value: string | null | undefined;
  zone?: string;
}): string =>
  zone
    ? (fromIso({value, zone})?.toFormat(DATE_FORMATS.zoneAbbreviation) ?? '')
    : '';

const isFutureInstant = ({value}: {value: string | null}): boolean =>
  Boolean(value) && DateTime.fromISO(value as string) > DateTime.now();

// Whole minutes from now until `value`; negative once it has passed.
const getMinutesUntil = ({value}: {value: string}): number =>
  Math.round(DateTime.fromISO(value).diffNow('minutes').minutes);

// "HH:mm" <-> DateTime, for time-only pickers whose form value is the string.
const fromTimeString = ({value}: {value: string}): DateTime | null => {
  if (!value) return null;

  const parsed = DateTime.fromFormat(value, DATE_FORMATS.time);

  return parsed.isValid ? parsed : null;
};

const toTimeString = ({value}: {value: DateTime | null}): string =>
  value && value.isValid ? value.toFormat(DATE_FORMATS.time) : '';

// Re-export DateTime (usable as both value and type) so consumers can avoid importing luxon directly
export {DateTime};

// Export the functions
export {
  toDateTime,
  toIsoString,
  toDateOnlyString,
  fromIso,
  getCurrentDateTime,
  getCurrentDate,
  formatDate,
  isValidDate,
  getFutureDate,
  formatToMinutesSeconds,
  calculateSecondsLeft,
  secondsUntilIso,
  secondsSinceIso,
  secondsBetweenIso,
  formatCountdown,
  formatElapsed,
  formatShortDuration,
  formatDurationLabel,
  getDaysUntil,
  isFutureDate,
  getToday,
  isTodayOrFuture,
  isBeforeToday,
  isToday,
  groupByDay,
  formatTimeOfDay,
  formatMillis,
  getTodayDayKey,
  getAgeInYears,
  getPastDateRange,
  getInclusiveDayCount,
  formatDateRangeLabel,
  getMillis,
  getRelativeTimeFromIso,
  combineDateAndTime,
  formatIso,
  formatZoneAbbreviation,
  nowInZone,
  isFutureInstant,
  getMinutesUntil,
  fromTimeString,
  toTimeString,
};
