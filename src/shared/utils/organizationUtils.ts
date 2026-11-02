import {WorkingHoursStatus} from '@/shared/types/settings';
import {formatTimeLabel} from '@/shared/utils/workingHours';

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

// Turns a WorkingHoursStatus into its display label, e.g. "Open now — closes
// at 05:00 PM". Takes `t` rather than calling useTranslation itself so it
// stays a plain function, usable outside a component if needed.
export const getWorkingHoursStatusLabel = ({
  status,
  t,
}: {
  status: WorkingHoursStatus;
  t: TranslateFn;
}): string => {
  switch (status.kind) {
    case 'openNow':
      return t('organizationSettings.openNow', {
        time: formatTimeLabel({time: status.closesAt}),
      });
    case 'closedOpensAt':
      return t('organizationSettings.closedOpensAt', {
        time: formatTimeLabel({time: status.opensAt}),
      });
    case 'closedOpensOn':
      return t('organizationSettings.closedOpensOn', {
        day: t(`organizationSettings.days.${status.day}`),
        time: formatTimeLabel({time: status.opensAt}),
      });
    default:
      return t('organizationSettings.closedAllWeek');
  }
};
