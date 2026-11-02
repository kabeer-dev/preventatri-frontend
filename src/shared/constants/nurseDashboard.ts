import {ThemeColor} from '@/@core/theme/types';
import {
  PatientsIcon,
  PendingFollowUpTasksIcon,
} from '@/shared/components/icons';
import {SUBMISSION_LIST_TAB} from '@/shared/constants/assessmentChecklists';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {
  EMERGENCY_FLAG_OPEN_TAB,
  FOLLOW_UP_PENDING_TAB,
} from '@/shared/constants/listToolbarTabs';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {FILTERS_CONFIG} from '@/shared/constants/reactQueryConstants';
import {RED_FLAG_OPEN_STATUS_FILTER} from '@/shared/constants/redFlag';
import {DashboardStatConfig} from '@/shared/interfaces/dashboard';
import {NurseDashboardStatKey} from '@/shared/interfaces/nurse';
import {buildDynamicURL} from '@/shared/utils/buildDynamicURL';

export const NURSE_DASHBOARD_ITEM_TYPES = {
  FOLLOW_UP: {
    value: 'FOLLOW_UP',
    labelKey: 'dashboard.nurseDashboard.myDay.types.followUp',
  },
  SUPERVISORY_VISIT: {
    value: 'SUPERVISORY_VISIT',
    labelKey: 'dashboard.nurseDashboard.myDay.types.supervisoryVisit',
  },
} as const;

export const NURSE_DASHBOARD_ITEM_TYPE_COLORS: Record<string, ThemeColor> = {
  [NURSE_DASHBOARD_ITEM_TYPES.FOLLOW_UP.value]: 'primary',
  [NURSE_DASHBOARD_ITEM_TYPES.SUPERVISORY_VISIT.value]: 'secondary',
};

export const NURSE_OPEN_ALERTS_HREF = buildDynamicURL({
  baseEndpoint: DASHBOARD_ROUTES.emergencyFlags.all(),
  params: {[LIST_TAB_URL_KEY]: EMERGENCY_FLAG_OPEN_TAB},
});

export const NURSE_DUE_TODAY_HREF = buildDynamicURL({
  baseEndpoint: DASHBOARD_ROUTES.followUps.all(),
  params: {[LIST_TAB_URL_KEY]: FOLLOW_UP_PENDING_TAB},
});

export const NURSE_DASHBOARD_STATS: DashboardStatConfig<NurseDashboardStatKey>[] =
  [
    {
      statKey: 'openAlerts',
      severity: 'critical',
      color: 'error',
      titleKey: 'dashboard.nurseDashboard.cards.openAlerts.title',
      subtitleKey: 'dashboard.nurseDashboard.cards.openAlerts.subtitle',
      hasSubtitleParams: true,
      href: NURSE_OPEN_ALERTS_HREF,
      drillLabelKey: 'dashboard.nurseDashboard.cards.openAlerts.drill',
    },
    {
      statKey: 'dueToday',
      icon: PendingFollowUpTasksIcon,
      color: 'warning',
      titleKey: 'dashboard.nurseDashboard.cards.dueToday.title',
      subtitleKey: 'dashboard.nurseDashboard.cards.dueToday.subtitle',
      hasSubtitleParams: true,
      href: NURSE_DUE_TODAY_HREF,
    },
    {
      statKey: 'myPatients',
      icon: PatientsIcon,
      color: 'primary',
      titleKey: 'dashboard.nurseDashboard.cards.myPatients.title',
      subtitleKey: 'dashboard.nurseDashboard.cards.myPatients.subtitle',
      href: DASHBOARD_ROUTES.patients.all(),
      drillLabelKey: 'dashboard.nurseDashboard.cards.myPatients.drill',
    },
  ];

export const NEEDS_ME_NOW_PARAMS = {
  [FILTER_PARAMS.status]: RED_FLAG_OPEN_STATUS_FILTER,
  sortBy: 'createdAt',
  sortDir: 'desc',
  page: 1,
  limit: 6,
};

export const buildNurseSubmissionsHref = ({tab}: {tab?: string} = {}) =>
  buildDynamicURL({
    baseEndpoint: DASHBOARD_ROUTES.submissions.all(),
    params: Object.assign(
      {number: FILTERS_CONFIG.number, limit: FILTERS_CONFIG.limit},
      tab ? {[LIST_TAB_URL_KEY]: tab} : {}
    ),
  });

export const NURSE_ASSESSMENT_COUNTS = [
  {
    key: 'submitted',
    labelKey: 'dashboard.nurseDashboard.assessments.submitted',
    color: 'text.primary',

    // The count also includes reviewed rows, which have their own tab.
    tab: SUBMISSION_LIST_TAB.submitted,
  },
  {
    key: 'missed',
    labelKey: 'dashboard.nurseDashboard.assessments.missed',
    color: 'error.main',
    tab: SUBMISSION_LIST_TAB.missed,
  },
  {
    key: 'skipped',
    labelKey: 'dashboard.nurseDashboard.assessments.skipped',
    color: 'warning.main',
    tab: SUBMISSION_LIST_TAB.skipped,
  },
] as const;

export const NURSE_DASHBOARD_GRID_SIZES = {
  stats: {xs: 12, sm: 6, lg: 4},
  main: {xs: 12, lg: 8},
  side: {xs: 12, lg: 4},
};
