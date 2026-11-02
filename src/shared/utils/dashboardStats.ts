import {
  DASHBOARD_STAT_EMPTY_PLACEHOLDER,
  DASHBOARD_STAT_FORMATS,
  DASHBOARD_STAT_PERCENT_SUFFIX,
} from '@/shared/constants/dashboard';
import {DashboardStatFormat} from '@/shared/interfaces/dashboard';
import {formatCountdown} from '@/shared/utils/dateUtils';

// Renders a dashboard stat's value per its optional `format`. `percent` appends
// a % sign, `duration` renders seconds as a compact countdown, and the default
// renders the plain integer. Null/undefined metrics (not loaded yet, or empty
// population) always render the placeholder — never a fake 0 — so missing data
// can't masquerade as "nothing pending". Shared by the stat-card grid and the
// dashboard export so both format values the same.
export const formatStatValue = ({
  value,
  format,
}: {
  value: number | null | undefined;
  format?: DashboardStatFormat;
}): string => {
  if (value === null || value === undefined)
    return DASHBOARD_STAT_EMPTY_PLACEHOLDER;

  if (format === DASHBOARD_STAT_FORMATS.PERCENT)
    return `${value}${DASHBOARD_STAT_PERCENT_SUFFIX}`;

  if (format === DASHBOARD_STAT_FORMATS.DURATION)
    return formatCountdown({seconds: value});

  return String(value);
};
