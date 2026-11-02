import {CHECKLIST_SUBMISSION_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES, ROUTE_ID} from '@/shared/constants/paths';

/** The two statuses that mean the caregiver did send the checklist. */
export const CAREGIVER_SENT_STATUSES: string[] = [
  CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
  CHECKLIST_SUBMISSION_STATUS.REVIEWED.value,
];

/**
 * The only two statuses the API will accept an answer on. Anything else is
 * either already with the nurse or closed by the office, so the caregiver is
 * never offered a checklist she cannot send.
 */
export const CAREGIVER_OPEN_STATUSES: string[] = [
  CHECKLIST_SUBMISSION_STATUS.PENDING.value,
  CHECKLIST_SUBMISSION_STATUS.LATE.value,
];

/**
 * Statuses worth loading for a caregiver's own work list. MISSED, VOIDED and
 * SKIPPED are dropped: they are closed, the API would refuse them, and leaving
 * them out keeps the list to work she can still do.
 */
export const CAREGIVER_CHECKLIST_STATUSES: string[] = [
  CHECKLIST_SUBMISSION_STATUS.UPCOMING.value,
  CHECKLIST_SUBMISSION_STATUS.PENDING.value,
  CHECKLIST_SUBMISSION_STATUS.LATE.value,
  CHECKLIST_SUBMISSION_STATUS.SUBMITTED.value,
  CHECKLIST_SUBMISSION_STATUS.REVIEWED.value,
];

/** Late cards Today shows before "Show all" has to be tapped. */
export const CAREGIVER_LATE_PREVIEW_COUNT = 3;

/** Hour boundaries that pick the greeting. */
export const CAREGIVER_GREETING_HOURS = {
  afternoon: 12,
  evening: 17,
} as const;

/**
 * A caregiver answers about two questions a minute, so a checklist's estimate
 * is half its question count, rounded up.
 */
export const CAREGIVER_QUESTIONS_PER_MINUTE = 2;

/** Phone shell sizes. The tab bar is fixed, so content has to clear it. */
export const CAREGIVER_LAYOUT = {
  tabBarHeight: 64,
} as const;

/** The desktop checklist table: one line of text with 14px above and below. */
export const CAREGIVER_TABLE = {
  rowHeight: 50,

  /** A day's work fits on one page; the pager only appears past this. */
  pageSize: 25,

  /**
   * Wide enough for "Late · was due 20 Aug" in the mono face without a wrap,
   * and narrow enough that the patient page's table fits beside its rail.
   */
  dueColumnMinWidth: 180,
} as const;

/**
 * Screens the redesign replaced for the caregiver, and what replaced them.
 * RoleGuard sends her from the route to its replacement instead of telling
 * her she is not authorised for her own work. `:id` in a route is handed to
 * the replacement builder.
 */
export const CAREGIVER_REPLACED_ROUTES: {
  route: string;
  replacement: ({id}: {id: string}) => string;
}[] = [
  {
    route: DASHBOARD_ROUTES.submissions.all(),
    replacement: () => DASHBOARD_ROUTES.activity.all(),
  },
  {
    route: DASHBOARD_ROUTES.emergencyFlags.all(),
    replacement: () => DASHBOARD_ROUTES.activity.all(),
  },
  {
    route: DASHBOARD_ROUTES.settings.all(),
    replacement: () => DASHBOARD_ROUTES.me.all(),
  },
  {
    route: DASHBOARD_ROUTES.patients.assessments(ROUTE_ID),
    replacement: ({id}) => DASHBOARD_ROUTES.patients.single({id}),
  },
  {
    // The patient is picked on the screen: an id never rides in the URL.
    route: DASHBOARD_ROUTES.patients.redFlag(ROUTE_ID),
    replacement: () => DASHBOARD_ROUTES.redFlag.all(),
  },
];

/**
 * Caregiver screens that own the bottom edge of the phone. The tab bar is
 * hidden on these, so the screen's pinned action sits on the edge itself and
 * a thumb cannot hit a tab by mistake mid-task.
 */
export const CAREGIVER_FULL_SCREEN_ROUTES = [
  DASHBOARD_ROUTES.checklist(ROUTE_ID),
  DASHBOARD_ROUTES.followUps.checklist(ROUTE_ID),
  DASHBOARD_ROUTES.redFlag.all(),
];

/** Phone screens that open with their own header instead of the page heading. */
export const CAREGIVER_PHONE_OWN_HEADER_ROUTES = [
  DASHBOARD_ROUTES.home(),
  DASHBOARD_ROUTES.me.all(),
];

export const CAREGIVER_DATE_FORMATS = {
  headerDay: 'ccc d LLL',
  dueDay: 'd LLL',
  nextDay: 'ccc d LLL',
  weekdayLong: 'cccc d LLLL',
} as const;

/** Sizes the checklist runner uses on both shells. */
export const CAREGIVER_RUNNER = {
  /** One progress bar, fixed so a long checklist wraps instead of shrinking. */
  segmentWidth: 18,
  segmentHeight: 3,
  segmentGap: 4,

  railWidth: 260,
  contextWidth: 300,
  questionMaxWidth: 640,
  answerButtonHeight: 64,
  optionRowHeight: 60,
} as const;

/** What Activity can show, and what the chips filter by. */
export const CAREGIVER_ACTIVITY_KINDS = {
  all: 'all',
  checklists: 'checklists',
  redFlags: 'redFlags',
} as const;

/** How far back Activity looks. Seven days is the opening view. */
export const CAREGIVER_ACTIVITY_RANGES = {
  week: 7,
  month: 30,
} as const;

/** URL keys Activity keeps its filters under. */
export const CAREGIVER_ACTIVITY_PARAMS = {
  kind: 'kind',
  patient: 'patient',
  range: 'range',
} as const;

/** "All patients" in the Activity patient select. */
export const CAREGIVER_ALL_PATIENTS = 'all';

/**
 * Shown in the Me footer. Set by a release, or filled from the package version
 * at build time in `next.config.ts`, so it is never typed here by hand.
 */
export const CAREGIVER_APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '';
