import {SYSTEM_ROLES} from '@/shared/constants/common';
import {SiteMapLink} from '@/shared/interfaces/utils';
import {
  extractRouteConfigs,
  extractRoutes,
  path,
} from '@/shared/utils/routeRegistry';

const {caregiver, admin, employee, nurse, caseManager, superAdmin} =
  SYSTEM_ROLES;

export const ROOT_ROUTE = '/';

export const AUTH_ROOT = '/auth';

export const DASHBOARD_ROOT = '/dashboard';

/** Stands in for the id when a route builder is asked for its pattern. */
export const ROUTE_ID = {id: ':id'};

export const AUTH_ROUTES = {
  login: () => path({root: AUTH_ROOT, path: '/login'}),
  register: () => path({root: AUTH_ROOT, path: '/register'}),
  otpVerification: () => path({root: AUTH_ROOT, path: '/otp-verification'}),
  reset: () => path({root: AUTH_ROOT, path: '/reset'}),
  unverifiedLoginAttempt: () =>
    path({
      root: AUTH_ROOT,
      path: '/unverified-login-attempt',
    }),
  verify: () => path({root: AUTH_ROOT, path: '/verify'}),
  forgotPassword: () => path({root: AUTH_ROOT, path: '/forgot-password'}),
  accountLocked: () => path({root: AUTH_ROOT, path: '/account-locked'}),
  unlockAccount: ({token}: {token: string}) =>
    path({root: AUTH_ROOT, path: `/unlock-account/${token}`}),
  acceptInvitation: () => path({root: AUTH_ROOT, path: '/accept-invitation'}),
  registerVerifyRequest: () =>
    path({root: AUTH_ROOT, path: '/link-sent/verify'}),
};

export const DASHBOARD_ROUTES = {
  home: () =>
    path({
      root: DASHBOARD_ROOT,
      path: '/',
      allowedRoles: [
        admin.value,
        caregiver.value,
        nurse.value,
        caseManager.value,
      ],
    }),

  // Where a person lands after joining another organization: it makes that
  // organization the current one. Every role can reach it.
  switchOrganization: ({organizationId}: {organizationId: string}) =>
    path({
      root: DASHBOARD_ROOT,
      path: `/switch-organization/${organizationId}`,
      allowedRoles: [
        admin.value,
        employee.value,
        caregiver.value,
        nurse.value,
        caseManager.value,
      ],
    }),

  // Caregiver-only screens in the redesigned portal. Today lives at the
  // dashboard root, so only these two need their own routes.
  activity: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/activity',
        allowedRoles: [caregiver.value],
      }),
  },
  me: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/me',
        allowedRoles: [caregiver.value],
      }),
  },

  // Raising a red flag away from a patient page. The phone opens this screen;
  // the desktop opens the same form in a dialog and never navigates here.
  redFlag: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/red-flag',
        allowedRoles: [caregiver.value],
      }),
  },
  notifications: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/notifications',
        allowedRoles: [
          admin.value,
          caregiver.value,
          nurse.value,
          caseManager.value,
        ],
      }),
  },
  users: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/users',
        allowedRoles: [admin.value],
      }),
  },
  triageEngine: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/triage-engine',
        allowedRoles: [admin.value],
      }),
  },
  nurses: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/nurses',
        allowedRoles: [admin.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/nurses/${id}`,
        allowedRoles: [admin.value],
      }),
  },
  caregivers: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/caregivers',
        allowedRoles: [admin.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/caregivers/${id}`,
        allowedRoles: [admin.value],
      }),
  },
  caseManagers: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/case-managers',
        allowedRoles: [admin.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/case-managers/${id}`,
        allowedRoles: [admin.value],
      }),
  },
  patients: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/patients',
        allowedRoles: [
          admin.value,
          caregiver.value,
          nurse.value,
          caseManager.value,
        ],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/patients/${id}`,
        allowedRoles: [
          admin.value,
          caregiver.value,
          nurse.value,
          caseManager.value,
        ],
      }),

    // The caregiver's checklists and red flag moved to her own screens, so
    // these two are the nurse's and the case manager's. RoleGuard forwards
    // her from them through CAREGIVER_REPLACED_ROUTES.
    assessments: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/patients/${id}/assessments`,
        allowedRoles: [nurse.value, caseManager.value],
      }),
    checklist: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/patients/${id}/checklist`,
        allowedRoles: [caregiver.value, nurse.value, caseManager.value],
      }),
    redFlag: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/patients/${id}/red-flag`,
        allowedRoles: [nurse.value, caseManager.value],
      }),
  },
  regions: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/regions',
        allowedRoles: [admin.value],
      }),
  },
  reports: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/reports',
        allowedRoles: [admin.value],
      }),
  },
  activityLog: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/activity-log',
        allowedRoles: [admin.value],
      }),
  },
  assessmentChecklists: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/assessment-checklists',
        allowedRoles: [admin.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/assessment-checklists/${id}`,
        allowedRoles: [admin.value],
      }),
    builder: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/assessment-checklists/${id}/builder`,
        allowedRoles: [admin.value],
      }),
  },
  checklist: ({id}: {id: string | number}): string =>
    path({
      root: DASHBOARD_ROOT,
      path: `/checklist/${id}`,
      allowedRoles: [caregiver.value, caseManager.value],
    }),
  submissions: {
    // The caregiver reads her own work on Activity, so only the detail route
    // below stays open to her: Activity's View links straight to it.
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/submissions',
        allowedRoles: [admin.value, nurse.value, caseManager.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/submissions/${id}`,
        allowedRoles: [
          admin.value,
          caregiver.value,
          nurse.value,
          caseManager.value,
        ],
      }),
  },
  emergencyFlags: {
    // Same as submissions: the list is gone for the caregiver, the detail
    // route stays because Activity links to it.
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/emergency-flags',
        allowedRoles: [admin.value, nurse.value, caseManager.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/emergency-flags/${id}`,
        allowedRoles: [
          admin.value,
          caregiver.value,
          nurse.value,
          caseManager.value,
        ],
      }),
  },

  // Any care-team role can own a task, so every role can open the pages; the
  // backend scopes what each one sees.
  followUps: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/follow-ups',
        allowedRoles: [
          admin.value,
          caseManager.value,
          nurse.value,
          caregiver.value,
        ],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/follow-ups/${id}`,
        allowedRoles: [
          admin.value,
          caseManager.value,
          nurse.value,
          caregiver.value,
        ],
      }),

    // The assignee answers the task's checklist one question at a time here.
    checklist: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/follow-ups/${id}/checklist`,
        allowedRoles: [
          admin.value,
          caseManager.value,
          nurse.value,
          caregiver.value,
        ],
      }),
  },

  // Read-only view of the HHAeXchange visit import. Admin only, matching the
  // Sync button that fills it.
  hhaVisits: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/hha-visits',
        allowedRoles: [admin.value],
      }),
  },

  // HHAeXchange sync history and the exceptions worklist. Admin only.
  hhaSync: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/hha-sync',
        allowedRoles: [admin.value],
      }),
    run: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/hha-sync/runs/${id}`,
        allowedRoles: [admin.value],
      }),
  },

  // Nurses, admins and case managers perform and review visits; caregivers
  // listed on one can open it. The backend scopes what each role sees.
  supervisoryVisits: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/supervisory-visits',
        allowedRoles: [admin.value, caseManager.value, nurse.value],
      }),
    single: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/supervisory-visits/${id}`,
        allowedRoles: [
          admin.value,
          caseManager.value,
          nurse.value,
          caregiver.value,
        ],
      }),

    // The assignee answers the visit's checklist one question at a time here.
    checklist: ({id}: {id: string | number}): string =>
      path({
        root: DASHBOARD_ROOT,
        path: `/supervisory-visits/${id}/checklist`,
        allowedRoles: [admin.value, caseManager.value, nurse.value],
      }),
  },
  settings: {
    all: () => path({root: DASHBOARD_ROOT, path: '/settings'}),
  },

  // The platform owner approves and suspends other organizations here. It is
  // the super admin's only screen.
  organizations: {
    all: () =>
      path({
        root: DASHBOARD_ROOT,
        path: '/organizations',
        allowedRoles: [superAdmin.value],
      }),
  },
};

export const AUTH_ROUTES_LIST = extractRoutes({
  routeObj: AUTH_ROUTES,
});

// DASHBOARD_ROUTE_CONFIGS is an array that looks as follows:
// { route: '/dashboard/', allowedRoles: [role] },
// { route: '/dashboard/nurses', allowedRoles: [role] },
// { route: '/dashboard/nurses/:param1', allowedRoles: [role] },
export const DASHBOARD_ROUTE_CONFIGS = extractRouteConfigs({
  routeObj: DASHBOARD_ROUTES,
});

export const DASHBOARD_ROUTES_LIST = DASHBOARD_ROUTE_CONFIGS.map(
  ({route}) => route
);

export const SITE_MAP_LINKS: {[key: string]: SiteMapLink} = {
  home: {
    url: ROOT_ROUTE,
    priority: 1,
    changeFrequency: 'daily',
    lastModified: new Date(),
  },
  login: {
    url: AUTH_ROUTES.login(),
    priority: 0.8,
    changeFrequency: 'daily',
    lastModified: new Date(),
  },
  register: {
    url: AUTH_ROUTES.register(),
    priority: 0.8,
    changeFrequency: 'daily',
    lastModified: new Date(),
  },
};
