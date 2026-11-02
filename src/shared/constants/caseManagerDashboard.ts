import {ThemeColor} from '@/@core/theme/types';
import {
  CheckMarkIcon,
  PatientsIcon,
  PendingFollowUpTasksIcon,
} from '@/shared/components/icons';
import {DASHBOARD_STAT_FORMATS} from '@/shared/constants/dashboard';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {CaseManagerDashboardStatKey} from '@/shared/interfaces/caseManager';
import {DashboardStatConfig} from '@/shared/interfaces/dashboard';

const CHECKLIST_TASKS_KEY = 'dashboard.caseManagerDashboard.checklistTasks';

export const CASE_MANAGER_DASHBOARD_ITEM_TYPES = {
  FOLLOW_UP: {
    value: 'FOLLOW_UP',
    labelKey: `${CHECKLIST_TASKS_KEY}.types.followUp`,
    color: 'primary',

    // Steps are ticked on the detail page; there is no separate submit page.
    submitRoute: DASHBOARD_ROUTES.followUps.single,
  },
  SUPERVISORY_VISIT: {
    value: 'SUPERVISORY_VISIT',
    labelKey: `${CHECKLIST_TASKS_KEY}.types.supervisoryVisit`,
    color: 'secondary',
    submitRoute: DASHBOARD_ROUTES.supervisoryVisits.single,
  },
} as const;

export const CASE_MANAGER_CHECKLIST_TASK_STATUSES: Record<
  'OVERDUE' | 'DUE_TODAY' | 'PENDING',
  {labelKey: string; color: ThemeColor}
> = {
  OVERDUE: {labelKey: `${CHECKLIST_TASKS_KEY}.status.overdue`, color: 'error'},
  DUE_TODAY: {
    labelKey: `${CHECKLIST_TASKS_KEY}.status.dueToday`,
    color: 'primary',
  },
  PENDING: {
    labelKey: `${CHECKLIST_TASKS_KEY}.status.pending`,
    color: 'warning',
  },
};

export const CASE_MANAGER_CHECKLIST_DUE_DATE_FORMAT = 'dd MMM';

export const CASE_MANAGER_CHECKLIST_TABLE_MIN_WIDTH = 640;

export const CASE_MANAGER_DASHBOARD_STATS: DashboardStatConfig<CaseManagerDashboardStatKey>[] =
  [
    {
      statKey: 'tasksAssignedToMe',
      icon: PendingFollowUpTasksIcon,
      color: 'warning',
      titleKey: 'dashboard.caseManagerDashboard.cards.tasksAssignedToMe.title',
      subtitleKey:
        'dashboard.caseManagerDashboard.cards.tasksAssignedToMe.subtitle',
      hasSubtitleParams: true,
      href: DASHBOARD_ROUTES.followUps.all(),
      drillLabelKey:
        'dashboard.caseManagerDashboard.cards.tasksAssignedToMe.drill',
    },
    {
      statKey: 'myPatients',
      icon: PatientsIcon,
      color: 'primary',
      titleKey: 'dashboard.caseManagerDashboard.cards.myPatients.title',
      subtitleKey: 'dashboard.caseManagerDashboard.cards.myPatients.subtitle',
      href: DASHBOARD_ROUTES.patients.all(),
      drillLabelKey: 'dashboard.caseManagerDashboard.cards.myPatients.drill',
    },
    {
      statKey: 'assessmentRate',
      icon: CheckMarkIcon,
      color: 'success',
      titleKey: 'dashboard.caseManagerDashboard.cards.assessmentRate.title',
      subtitleKey:
        'dashboard.caseManagerDashboard.cards.assessmentRate.subtitle',
      hasSubtitleParams: true,
      format: DASHBOARD_STAT_FORMATS.PERCENT,
      href: DASHBOARD_ROUTES.emergencyFlags.all(),
      drillLabelKey:
        'dashboard.caseManagerDashboard.cards.assessmentRate.drill',
    },
  ];

export const CASE_MANAGER_DASHBOARD_STATS_GRID_SIZE = {xs: 12, sm: 6, lg: 4};
