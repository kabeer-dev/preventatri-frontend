import {ThemeColor} from '@/@core/theme/types';
import {ACTIVE_STATUS} from '@/shared/constants/common';

interface StatusConfigEntry {
  label: string;
  value: string;
  color: ThemeColor;
}

type StatusMap = Readonly<Record<string, StatusConfigEntry>>;

/**
 * Derives status display info (normalized value, label, icon, color)
 * from a raw status string. Reusable across nurse, caregiver, and
 * case-manager detail pages.
 *
 * `statusMap` defaults to the shared two-value ACTIVE_STATUS, which is what
 * nurses and case managers use. Caregivers pass CAREGIVER_STATUS instead:
 * CaregiverStatus has six members, and resolving HOLD / ON_LEAVE / TERMINATED /
 * REJECTED against the two-value map would render the raw enum string in amber.
 *
 * The map is a parameter rather than a swapped import precisely because this
 * helper is shared — changing the module-level default would have broken the
 * nurse and case-manager detail pages.
 */
export const getStatusDisplayInfo = ({
  status,
  label,
  statusMap = ACTIVE_STATUS,
  archivedLabel,
}: {
  status?: string;
  label: string;
  statusMap?: StatusMap;

  /** Set for an archived person: the stat reads this in place of the status. */
  archivedLabel?: string;
}) => {
  const normalizedStatus = status?.toLowerCase();

  const statusConfig = normalizedStatus
    ? statusMap[normalizedStatus]
    : undefined;

  const statusLabel = statusConfig?.label || status || 'N/A';

  return {
    normalizedStatus,
    statusConfig,
    statusLabel,
    statusStat: {
      // Keyed off the RESOLVED colour, not off an equality test against
      // 'active': with six caregiver statuses, an equality test drew a ✗ beside
      // the words "On Leave". A status the map does not know still falls
      // through to ✗, which is the honest answer for an unrecognised value.
      icon: archivedLabel
        ? 'mdi:archive-outline'
        : statusConfig?.color === ACTIVE_STATUS.active.color
          ? 'mdi:check-circle-outline'
          : 'mdi:close-circle-outline',
      value: archivedLabel ?? statusLabel,
      label,
      color: archivedLabel
        ? ('secondary' as const)
        : statusConfig?.color || ('warning' as const),
    },
  };
};
