import {SYSTEM_ROLES} from '@/shared/constants/common';
import {DASHBOARD_ROUTES, ROUTE_ID} from '@/shared/constants/paths';
import {PageHeadingProps} from '@/shared/interfaces/layout';

// Keys are route patterns. Detail pages that render their own RecordHeading in
// the top bar (patient, nurse, caregiver, case manager, alert, submission,
// follow-up, visit and checklist details and the checklist builder) are left out so the bar never shows two
// headings. Screens that only some roles draw themselves (the caregiver's
// Today, her checklist runner) list those roles in `hiddenForRoles`.
export const PAGE_HEADINGS: Record<string, PageHeadingProps> = {
  [DASHBOARD_ROUTES.home()]: {
    title: 'Dashboard',
    hiddenForRoles: [SYSTEM_ROLES.caregiver.value],
  },
  [DASHBOARD_ROUTES.notifications.all()]: {
    crumb: 'Notifications',
    title: 'Notifications',
  },
  [DASHBOARD_ROUTES.users.all()]: {
    crumb: 'Users & Roles',
    title: 'Users & Roles',
  },
  [DASHBOARD_ROUTES.organizations.all()]: {
    crumb: 'Organizations',
    title: 'Organizations',
  },
  [DASHBOARD_ROUTES.patients.all()]: {crumb: 'Patients', title: 'Patients'},
  [DASHBOARD_ROUTES.patients.assessments(ROUTE_ID)]: {
    crumb: 'Patients',
    title: 'Assessments',
  },
  [DASHBOARD_ROUTES.patients.checklist(ROUTE_ID)]: {
    crumb: 'Patients',
    title: 'Checklist',
  },
  [DASHBOARD_ROUTES.patients.redFlag(ROUTE_ID)]: {
    crumb: 'Patients',
    title: 'Red flag',
  },
  [DASHBOARD_ROUTES.triageEngine.all()]: {
    crumb: 'Triage Engine',
    title: 'Triage Engine',
  },
  [DASHBOARD_ROUTES.emergencyFlags.all()]: {crumb: 'Alerts', title: 'Alerts'},
  [DASHBOARD_ROUTES.followUps.all()]: {
    crumb: 'Follow-up tasks',
    title: 'Follow-up tasks',
  },
  [DASHBOARD_ROUTES.hhaVisits.all()]: {
    crumb: 'HHA visits',
    title: 'HHA visits',
  },
  [DASHBOARD_ROUTES.hhaSync.all()]: {
    crumb: 'HHA sync',
    title: 'HHA sync',
  },
  [DASHBOARD_ROUTES.hhaSync.run(ROUTE_ID)]: {
    crumb: 'HHA sync',
    title: 'Sync run',
  },
  [DASHBOARD_ROUTES.supervisoryVisits.all()]: {
    crumb: 'Supervisory visits',
    title: 'Supervisory visits',
  },
  [DASHBOARD_ROUTES.supervisoryVisits.checklist(ROUTE_ID)]: {
    crumb: 'Supervisory visits',
    title: 'File supervisory visit',
  },
  [DASHBOARD_ROUTES.assessmentChecklists.all()]: {title: 'Checklists'},
  [DASHBOARD_ROUTES.checklist(ROUTE_ID)]: {
    crumb: 'Assessments',
    title: 'Checklist',
    hiddenForRoles: [SYSTEM_ROLES.caregiver.value],
  },
  [DASHBOARD_ROUTES.activity.all()]: {crumb: 'Activity', title: 'Activity'},
  [DASHBOARD_ROUTES.me.all()]: {crumb: 'Me', title: 'Me'},
  [DASHBOARD_ROUTES.redFlag.all()]: {
    crumb: 'Red flag',
    title: 'Raise a red flag',
  },
  [DASHBOARD_ROUTES.submissions.all()]: {
    crumb: 'Submissions',
    title: 'Submissions',
  },
  [DASHBOARD_ROUTES.regions.all()]: {
    crumb: 'Regions & counties',
    title: 'Regions & counties',
  },
  [DASHBOARD_ROUTES.reports.all()]: {crumb: 'Reports', title: 'Reports'},
  [DASHBOARD_ROUTES.activityLog.all()]: {
    crumb: 'Activity log',
    title: 'Activity log',
  },
  [DASHBOARD_ROUTES.settings.all()]: {crumb: 'Settings', title: 'Settings'},
};
