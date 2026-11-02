import {DAYS_ORDER} from '@/shared/constants/settings';
import {WorkingHours, WorkingHoursStatus} from '@/shared/types/settings';
import {DateTime} from '@/shared/utils/dateUtils';

export const formatTimeLabel = ({time}: {time: string}): string => {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(displayHours).padStart(2, '0')}:${minutesStr} ${period}`;
};

const timeToMinutes = ({time}: {time: string}): number => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

// Derives the organization's live open/closed status from its weekly
// working hours and the current time. Runs entirely client-side since the
// API has no dedicated status field. `zone` is the organization's selected
// IANA time zone so the status reflects that zone rather than the viewer's.
export const getWorkingHoursStatus = ({
  workingHours,
  zone,
}: {
  workingHours: WorkingHours;
  zone?: string;
}): WorkingHoursStatus => {
  const now = zone ? DateTime.now().setZone(zone) : DateTime.now();
  const todayIndex = now.weekday - 1;
  const nowMinutes = now.hour * 60 + now.minute;

  const today = workingHours[DAYS_ORDER[todayIndex]];

  if (today.enabled) {
    const start = timeToMinutes({time: today.startTime});
    const end = timeToMinutes({time: today.endTime});

    if (nowMinutes >= start && nowMinutes < end) {
      return {kind: 'openNow', closesAt: today.endTime};
    }

    if (nowMinutes < start) {
      return {kind: 'closedOpensAt', opensAt: today.startTime};
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = DAYS_ORDER[(todayIndex + offset) % 7];
    const dayHours = workingHours[day];

    if (dayHours.enabled) {
      return {kind: 'closedOpensOn', day, opensAt: dayHours.startTime};
    }
  }

  return {kind: 'closedAllWeek'};
};
