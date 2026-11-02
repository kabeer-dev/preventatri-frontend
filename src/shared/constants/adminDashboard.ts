import {SUBMISSION_LIST_TAB} from '@/shared/constants/assessmentChecklists';
import {LIST_TAB_URL_KEY} from '@/shared/constants/listToolbar';
import {OPEN_CRITICAL_ALERTS_HREF} from '@/shared/constants/listToolbarTabs';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {FILTERS_CONFIG} from '@/shared/constants/reactQueryConstants';
import {
  AdminDashboardActionStatKey,
  DashboardStatConfig,
  FlagsRaisedTierConfig,
} from '@/shared/interfaces/dashboard';
import {buildDynamicURL} from '@/shared/utils/buildDynamicURL';

export const ADMIN_DASHBOARD_ACTION_STATS: DashboardStatConfig<AdminDashboardActionStatKey>[] =
  [
    {
      statKey: 'openRedFlags',
      severity: 'critical',
      color: 'error',
      titleKey: 'dashboard.adminDashboard.cards.openRedFlags.title',
      href: OPEN_CRITICAL_ALERTS_HREF,
      drillLabelKey: 'dashboard.adminDashboard.cards.openRedFlags.drill',
    },
    {
      statKey: 'slaAtRisk',
      severity: 'atRisk',
      color: 'warning',
      titleKey: 'dashboard.adminDashboard.cards.slaAtRisk.title',
      href: DASHBOARD_ROUTES.emergencyFlags.all(),
      drillLabelKey: 'dashboard.adminDashboard.cards.slaAtRisk.drill',
    },
    {
      statKey: 'pendingAssessments',
      severity: 'stable',
      color: 'success',
      titleKey: 'dashboard.adminDashboard.cards.pendingAssessments.title',
      href: buildDynamicURL({
        baseEndpoint: DASHBOARD_ROUTES.submissions.all(),
        params: {
          [LIST_TAB_URL_KEY]: SUBMISSION_LIST_TAB.pending,
          number: FILTERS_CONFIG.number,
          limit: FILTERS_CONFIG.limit,
        },
      }),
      drillLabelKey: 'dashboard.adminDashboard.cards.pendingAssessments.drill',
    },
    {
      statKey: 'activePatients',
      severity: 'monitored',
      color: 'primary',
      titleKey: 'dashboard.adminDashboard.cards.activePatients.title',
      href: DASHBOARD_ROUTES.patients.all(),
      drillLabelKey: 'dashboard.adminDashboard.cards.activePatients.drill',
    },
  ];

// Highest level first: this is the legend order.
export const FLAGS_RAISED_TIERS: FlagsRaisedTierConfig[] = [
  {
    level: 2,
    seriesKey: 'red',
    labelKey: 'dashboard.adminDashboard.flagsRaised.tiers.red',
    colorKey: 'severityCriticalFg',
  },
  {
    level: 1,
    seriesKey: 'yellow',
    labelKey: 'dashboard.adminDashboard.flagsRaised.tiers.yellow',
    colorKey: 'severityModerateFg',
  },
  {
    level: 0,
    seriesKey: 'green',
    labelKey: 'dashboard.adminDashboard.flagsRaised.tiers.green',
    colorKey: 'severityStableFg',
  },
];

// Responsive column spans for each admin dashboard row.
export const ADMIN_DASHBOARD_GRID_SIZES = {
  action: {xs: 12, sm: 6, lg: 3},
  flagsRaised: {xs: 12, lg: 7},
  slaCompliance: {xs: 12, lg: 5},

  alertQueue: {xs: 12, lg: 7},
  recentActivity: {xs: 12, lg: 5},
};
