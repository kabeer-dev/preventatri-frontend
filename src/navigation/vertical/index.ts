import {VerticalNavItemsType} from '@/@core/layouts/types';
import ActivityLogIcon from '@/shared/assets/icons/activityLog.svg';
import AlertsIcon from '@/shared/assets/icons/alerts.svg';
import ChecklistsIcon from '@/shared/assets/icons/checklists.svg';
import DashboardIcon from '@/shared/assets/icons/dashboard.svg';
import FollowUpTasksIcon from '@/shared/assets/icons/followUpTasks.svg';
import NotificationsIcon from '@/shared/assets/icons/notifications.svg';
import PatientsIcon from '@/shared/assets/icons/patients.svg';
import RegionsIcon from '@/shared/assets/icons/regions.svg';
import ReportsIcon from '@/shared/assets/icons/reports.svg';
import SettingsIcon from '@/shared/assets/icons/settings.svg';
import SupervisoryVisitsIcon from '@/shared/assets/icons/supervisoryVisits.svg';
import {SYSTEM_ROLES} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';

const {admin, caregiver, nurse, caseManager, superAdmin} = SYSTEM_ROLES;

const allRoles = [admin.value, caregiver.value, nurse.value, caseManager.value];

const navigation = (): VerticalNavItemsType => {
  return [
    {sectionTitle: 'Platform'},
    {
      title: 'Organizations',
      icon: 'mdi:domain',
      path: DASHBOARD_ROUTES.organizations.all(),
      roles: [superAdmin.value],
    },

    {sectionTitle: 'Overview'},
    {
      title: 'Dashboard',
      icon: DashboardIcon,
      path: '/dashboard',
      roles: allRoles,
    },
    {
      title: 'Notifications',
      icon: NotificationsIcon,
      path: DASHBOARD_ROUTES.notifications.all(),
      roles: allRoles,
    },

    {sectionTitle: 'People'},
    {
      title: 'Users & Roles',
      icon: 'mdi:account-group-outline',
      path: DASHBOARD_ROUTES.users.all(),
      activePaths: [
        DASHBOARD_ROUTES.nurses.all(),
        DASHBOARD_ROUTES.caregivers.all(),
        DASHBOARD_ROUTES.caseManagers.all(),
      ],
      roles: [admin.value],
    },
    {
      title: 'Patients',
      icon: PatientsIcon,
      path: DASHBOARD_ROUTES.patients.all(),
      roles: allRoles,
    },

    {sectionTitle: 'Clinical operations'},
    {
      title: 'Triage Engine',
      icon: 'mdi:alert-circle-outline',
      path: DASHBOARD_ROUTES.triageEngine.all(),
      roles: [admin.value],
    },
    {
      title: 'Alerts',
      icon: AlertsIcon,
      path: DASHBOARD_ROUTES.emergencyFlags.all(),
      roles: allRoles,
    },
    {
      title: 'Follow-up tasks',
      icon: FollowUpTasksIcon,
      path: DASHBOARD_ROUTES.followUps.all(),
      roles: [admin.value, caseManager.value, nurse.value],
    },
    {
      title: 'Supervisory visits',
      icon: SupervisoryVisitsIcon,
      path: DASHBOARD_ROUTES.supervisoryVisits.all(),
      roles: [admin.value, caseManager.value, nurse.value],
    },
    {
      title: 'HHA Visits',
      icon: 'mdi:calendar-clock-outline',
      path: DASHBOARD_ROUTES.hhaVisits.all(),
      roles: [admin.value],
      requiresHha: true,
    },
    {
      title: 'HHA Sync',
      icon: 'mdi:cloud-sync-outline',
      path: DASHBOARD_ROUTES.hhaSync.all(),
      roles: [admin.value],
      requiresHha: true,
    },
    {
      title: 'Checklists',
      icon: ChecklistsIcon,
      path: DASHBOARD_ROUTES.assessmentChecklists.all(),
      roles: [admin.value],
    },
    {
      title: 'Submissions',
      icon: 'mdi:file-check-outline',
      path: DASHBOARD_ROUTES.submissions.all(),
      roles: allRoles,
    },

    {sectionTitle: 'Organization'},
    {
      title: 'Regions & counties',
      icon: RegionsIcon,
      path: DASHBOARD_ROUTES.regions.all(),
      roles: [admin.value],
    },
    {
      title: 'Reports',
      icon: ReportsIcon,
      path: DASHBOARD_ROUTES.reports.all(),
      roles: [admin.value],
    },
    {
      title: 'Activity log',
      icon: ActivityLogIcon,
      path: DASHBOARD_ROUTES.activityLog.all(),
      roles: [admin.value],
    },
    {
      title: 'Settings',
      icon: SettingsIcon,
      path: DASHBOARD_ROUTES.settings.all(),
    },
  ];
};

export default navigation;
