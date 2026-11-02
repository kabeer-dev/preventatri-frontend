import {VerticalNavItemsType} from '@/@core/layouts/types';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';

/**
 * The caregiver's sidebar: four destinations, then the one action she may
 * need from any screen. "Raise a red flag" carries no route: it opens the red
 * flag dialog over the page she is already on.
 */
const caregiverNavigation = ({
  lateCount,
  lateLabel,
  todayLabel,
  patientsLabel,
  activityLabel,
  notificationsLabel,
  redFlagLabel,
  onRaiseRedFlag,
}: {
  lateCount: number;
  lateLabel: string;
  todayLabel: string;
  patientsLabel: string;
  activityLabel: string;
  notificationsLabel: string;
  redFlagLabel: string;
  onRaiseRedFlag: () => void;
}): VerticalNavItemsType => [
  {
    title: todayLabel,
    icon: 'mdi:calendar-today-outline',
    path: DASHBOARD_ROUTES.home(),
    ...(lateCount > 0
      ? {badgeContent: lateLabel, badgeColor: 'error' as const}
      : {}),
  },
  {
    title: patientsLabel,
    icon: 'mdi:account-group-outline',
    path: DASHBOARD_ROUTES.patients.all(),
  },
  {
    title: activityLabel,
    icon: 'mdi:pulse',
    path: DASHBOARD_ROUTES.activity.all(),
  },
  {
    title: notificationsLabel,
    icon: 'mdi:bell-outline',
    path: DASHBOARD_ROUTES.notifications.all(),
  },
  {
    title: redFlagLabel,
    icon: 'mdi:flag-outline',
    isDanger: true,
    onClick: onRaiseRedFlag,
  },
];

export default caregiverNavigation;
