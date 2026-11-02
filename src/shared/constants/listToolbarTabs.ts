import {ACTIVITY_LOG_VIEW} from '@/shared/constants/activityLog';
import {
  ASSESSMENT_CHECKLIST_STATUS,
  CHECKLIST_SUBMISSION_STATUS,
} from '@/shared/constants/assessmentChecklists';
import {EMERGENCY_FLAG_FILTERS} from '@/shared/constants/flag';
import {FOLLOW_UP_TASK_STATUS} from '@/shared/constants/followUps';
import {FILTER_PARAMS} from '@/shared/constants/general';
import {
  HHA_COORDINATOR_CHOICE_FILTERS,
  HHA_EMAIL_CONFLICT_FILTERS,
  HHA_SYNC_EXCEPTION_STATUS,
  HHA_SYNC_FILTER_PARAMS,
  HHA_SYNC_RESOURCES,
  HHA_SYNC_RUN_STATUS,
  HHA_SYNC_VIEWS,
} from '@/shared/constants/hhaSyncHistory';
import {HHA_VISIT_STATUS} from '@/shared/constants/hhaVisits';
import {
  LIST_FILTER_ICONS,
  LIST_TAB_ALL,
  LIST_TAB_URL_KEY,
  UNSUPPORTED_FILTER_PARAMS,
} from '@/shared/constants/listToolbar';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {
  PATIENT_ARCHIVE_FILTER,
  PATIENT_CURRENT_STATUSES,
  PATIENT_LIST_PARAMS,
  PATIENT_STATUS,
} from '@/shared/constants/patients';
import {
  RED_FLAG_OPEN_STATUS_FILTER,
  RED_FLAG_STATUS,
} from '@/shared/constants/redFlag';
import {REGION_LIST_PARAMS, REGION_TAB} from '@/shared/constants/regions';
import {
  SUPERVISORY_VISIT_OPEN_STATUSES,
  SUPERVISORY_VISIT_STATUS,
} from '@/shared/constants/supervisoryVisits';
import {TRIAGE_FLAG_ENUM} from '@/shared/constants/triageEngine';
import {
  ListTabConfig,
  UnsupportedFilterConfig,
} from '@/shared/interfaces/listToolbar';
import {buildDynamicURL} from '@/shared/utils/buildDynamicURL';
import {buildTabParams} from '@/shared/utils/listToolbar';

const ALL_TAB: ListTabConfig = {
  value: LIST_TAB_ALL,
  labelKey: 'listToolbar.all',
};

const PATIENT_STATUS_TAB_LABEL_KEYS: Record<string, string> = {
  [PATIENT_STATUS.active.value]: 'patients.table.filterArchiveActive',
  [PATIENT_STATUS.waiting.value]: 'patients.table.filterStatusWaiting',
  [PATIENT_STATUS.hold.value]: 'patients.table.filterStatusHold',
  [PATIENT_STATUS.discharged.value]: 'patients.table.filterArchiveDischarged',
  [PATIENT_STATUS.hospitalized.value]:
    'patients.table.filterStatusHospitalized',
};

// A status tab only lists current patients; archived ones have their own tab.
const PATIENT_STATUS_TABS: ListTabConfig[] = PATIENT_CURRENT_STATUSES.map(
  ({value}) => ({
    value,
    labelKey: PATIENT_STATUS_TAB_LABEL_KEYS[value],
    params: {
      [PATIENT_LIST_PARAMS.archiveFilter]: PATIENT_ARCHIVE_FILTER.active,
      [PATIENT_LIST_PARAMS.status]: value.toUpperCase(),
    },
  })
);

export const PATIENT_LIST_TABS: ListTabConfig[] = [
  {
    value: PATIENT_ARCHIVE_FILTER.all,
    labelKey: 'patients.table.filterArchiveAll',
    params: buildTabParams({
      param: PATIENT_LIST_PARAMS.archiveFilter,
      value: PATIENT_ARCHIVE_FILTER.all,
    }),
  },
  ...PATIENT_STATUS_TABS,
  {
    value: PATIENT_ARCHIVE_FILTER.archived,
    labelKey: 'patients.table.filterArchiveArchived',
    params: buildTabParams({
      param: PATIENT_LIST_PARAMS.archiveFilter,
      value: PATIENT_ARCHIVE_FILTER.archived,
    }),
  },
];

// Other roles only see current patients, so their All is the active view.
export const PATIENT_READ_ONLY_LIST_TABS: ListTabConfig[] = [
  {
    value: PATIENT_ARCHIVE_FILTER.all,
    labelKey: 'patients.table.filterArchiveAll',
    params: buildTabParams({
      param: PATIENT_LIST_PARAMS.archiveFilter,
      value: PATIENT_ARCHIVE_FILTER.active,
    }),
  },
  ...PATIENT_STATUS_TABS,
];

// Archived regions are opt-in on the endpoint, so every tab but Archived and All
// asks for live regions explicitly.
export const REGION_LIST_TABS: ListTabConfig[] = [
  {
    value: REGION_TAB.all,
    labelKey: 'region.tabs.all',
    params: {[REGION_LIST_PARAMS.archiveFilter]: 'all'},
  },
  {
    value: REGION_TAB.active,
    labelKey: 'region.tabs.active',
    params: {
      [REGION_LIST_PARAMS.archiveFilter]: 'active',
      [REGION_LIST_PARAMS.isActive]: 'true',
    },
  },
  {
    value: REGION_TAB.inactive,
    labelKey: 'region.tabs.inactive',
    params: {
      [REGION_LIST_PARAMS.archiveFilter]: 'active',
      [REGION_LIST_PARAMS.isActive]: 'false',
    },
  },
  {
    value: REGION_TAB.archived,
    labelKey: 'region.tabs.archived',
    params: {[REGION_LIST_PARAMS.archiveFilter]: 'archived'},
  },
];

export const EMERGENCY_FLAG_OPEN_TAB = 'open';

export const EMERGENCY_FLAG_LIST_TABS: ListTabConfig[] = [
  ALL_TAB,
  {
    value: EMERGENCY_FLAG_OPEN_TAB,
    labelKey: 'emergencyFlags.tabs.open',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_OPEN_STATUS_FILTER,
    }),
  },
  {
    value: 'accepted',
    labelKey: 'emergencyFlags.tabs.accepted',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_STATUS.ACCEPTED.value,
    }),
  },
  {
    value: 'resolved',
    labelKey: 'emergencyFlags.tabs.resolved',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_STATUS.RESOLVED.value,
    }),
  },
  {
    value: 'voided',
    labelKey: 'emergencyFlags.tabs.voided',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_STATUS.VOIDED.value,
    }),
  },
];

// The patient detail page's alerts table: open (pending or accepted) by
// default, resolved on the other tab. Voided alerts show on neither.
export const PATIENT_ALERTS_TAB_URL_KEY = 'alertsTab';

export const PATIENT_ALERT_TABS: ListTabConfig[] = [
  {
    value: EMERGENCY_FLAG_OPEN_TAB,
    labelKey: 'emergencyFlags.tabs.open',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_OPEN_STATUS_FILTER,
    }),
  },
  {
    value: 'resolved',
    labelKey: 'emergencyFlags.tabs.resolved',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: RED_FLAG_STATUS.RESOLVED.value,
    }),
  },
];

const buildOpenAlertsHref = ({flag}: {flag: string}) =>
  buildDynamicURL({
    baseEndpoint: DASHBOARD_ROUTES.emergencyFlags.all(),
    params: {
      [LIST_TAB_URL_KEY]: EMERGENCY_FLAG_OPEN_TAB,
      [FILTER_PARAMS.flag]: flag,
    },
  });

export const OPEN_CRITICAL_ALERTS_HREF = buildOpenAlertsHref({
  flag: EMERGENCY_FLAG_FILTERS.RED,
});

export const OPEN_MODERATE_ALERTS_HREF = buildOpenAlertsHref({
  flag: EMERGENCY_FLAG_FILTERS.YELLOW,
});

const triageSeverityTab = ({
  value,
  flag,
}: {
  value: string;
  flag: string;
}): ListTabConfig => ({
  value,
  labelKey: `severity.${value}`,
  params: buildTabParams({param: FILTER_PARAMS.flag, value: flag}),
});

export const TRIAGE_ALERT_LIST_TABS: ListTabConfig[] = [
  ALL_TAB,
  triageSeverityTab({value: 'critical', flag: TRIAGE_FLAG_ENUM.RED}),
  triageSeverityTab({value: 'moderate', flag: TRIAGE_FLAG_ENUM.YELLOW}),
  triageSeverityTab({value: 'stable', flag: TRIAGE_FLAG_ENUM.GREEN}),
];

const followUpStatusTab = ({
  value,
  status,
}: {
  value: string;
  status: string;
}): ListTabConfig => ({
  value,
  labelKey: `followUps.tabs.${value}`,
  params: buildTabParams({param: FILTER_PARAMS.status, value: status}),
});

export const FOLLOW_UP_OVERDUE_TAB = 'overdue';

export const FOLLOW_UP_PENDING_TAB = 'pending';

export const FOLLOW_UP_LIST_TABS: ListTabConfig[] = [
  ALL_TAB,
  followUpStatusTab({
    value: FOLLOW_UP_OVERDUE_TAB,
    status: FOLLOW_UP_TASK_STATUS.OVERDUE.value,
  }),
  followUpStatusTab({
    value: FOLLOW_UP_PENDING_TAB,
    status: FOLLOW_UP_TASK_STATUS.PENDING.value,
  }),
  followUpStatusTab({
    value: 'completed',
    status: FOLLOW_UP_TASK_STATUS.COMPLETED.value,
  }),
  followUpStatusTab({
    value: 'cancelled',
    status: FOLLOW_UP_TASK_STATUS.CANCELLED.value,
  }),
];

const supervisoryVisitStatusTab = ({
  value,
  status,
}: {
  value: string;
  status: string;
}): ListTabConfig => ({
  value,
  labelKey: `supervisoryVisits.tabs.${value}`,
  params: buildTabParams({param: FILTER_PARAMS.status, value: status}),
});

export const SUPERVISORY_VISIT_DUE_THIS_WEEK_TAB = 'dueThisWeek';

const SUPERVISORY_VISIT_SCHEDULED_TAB = 'scheduled';
const SUPERVISORY_VISIT_OVERDUE_TAB = 'overdue';

// "Due this week" carries the current week's window, so the tabs are built at
// render time from the range the caller computes.
export const buildSupervisoryVisitListTabs = ({
  scheduledFrom,
  scheduledTo,
}: {
  scheduledFrom: string;
  scheduledTo: string;
}): ListTabConfig[] => [
  ALL_TAB,
  supervisoryVisitStatusTab({
    value: SUPERVISORY_VISIT_SCHEDULED_TAB,
    status: SUPERVISORY_VISIT_STATUS.SCHEDULED.value,
  }),
  {
    value: SUPERVISORY_VISIT_DUE_THIS_WEEK_TAB,
    labelKey: 'supervisoryVisits.tabs.dueThisWeek',
    params: {
      [FILTER_PARAMS.status]: SUPERVISORY_VISIT_OPEN_STATUSES.join(','),
      [FILTER_PARAMS.scheduledFrom]: scheduledFrom,
      [FILTER_PARAMS.scheduledTo]: scheduledTo,
    },
  },
  supervisoryVisitStatusTab({
    value: SUPERVISORY_VISIT_OVERDUE_TAB,
    status: SUPERVISORY_VISIT_STATUS.OVERDUE.value,
  }),
  supervisoryVisitStatusTab({
    value: 'underReview',
    status: SUPERVISORY_VISIT_STATUS.UNDER_REVIEW.value,
  }),
  supervisoryVisitStatusTab({
    value: 'approved',
    status: SUPERVISORY_VISIT_STATUS.APPROVED.value,
  }),
  supervisoryVisitStatusTab({
    value: 'cancelled',
    status: SUPERVISORY_VISIT_STATUS.CANCELLED.value,
  }),
];

export const SUPERVISORY_VISIT_UNSUPPORTED_FILTERS: UnsupportedFilterConfig[] =
  [
    {
      param: UNSUPPORTED_FILTER_PARAMS.region,
      labelKey: 'filters.region',
      icon: LIST_FILTER_ICONS.region,
    },
  ];

export const HHA_VISIT_LIST_TABS: ListTabConfig[] = [
  ALL_TAB,
  ...[
    HHA_VISIT_STATUS.scheduled,
    HHA_VISIT_STATUS.inProgress,
    HHA_VISIT_STATUS.unconfirmed,
    HHA_VISIT_STATUS.completed,
    HHA_VISIT_STATUS.missed,
    HHA_VISIT_STATUS.deleted,
  ].map((status) => ({
    value: status.value,
    labelKey: status.labelKey,
    params: buildTabParams({param: FILTER_PARAMS.status, value: status.value}),
  })),
];

export const ASSESSMENT_CHECKLIST_LIST_TABS: ListTabConfig[] = [
  ALL_TAB,
  {
    value: 'active',
    labelKey: 'assessmentChecklists.tabs.active',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value,
    }),
  },
  {
    value: 'draft',
    labelKey: 'assessmentChecklists.tabs.draft',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: ASSESSMENT_CHECKLIST_STATUS.DRAFT.value,
    }),
  },
  {
    value: 'archived',
    labelKey: 'assessmentChecklists.tabs.archived',
    params: buildTabParams({
      param: FILTER_PARAMS.status,
      value: ASSESSMENT_CHECKLIST_STATUS.ARCHIVED.value,
    }),
  },
];

// One tab per status a row can show, labelled like the row's status chip.
export const SUBMISSION_LIST_TABS: ListTabConfig[] = [ALL_TAB].concat(
  Object.values(CHECKLIST_SUBMISSION_STATUS).map(({value}) => ({
    value: value.toLowerCase(),
    labelKey: `submissions.status.${value.toLowerCase()}`,
    params: buildTabParams({param: FILTER_PARAMS.status, value}),
  }))
);

// The activity log page's two views. Not a filter on one list: each tab shows
// a different log, so neither carries request params.
export const ACTIVITY_LOG_VIEW_TABS: ListTabConfig[] = [
  {value: ACTIVITY_LOG_VIEW.audit, labelKey: 'activityLog.views.audit'},
  {value: ACTIVITY_LOG_VIEW.system, labelKey: 'activityLog.views.system'},
];

const buildHhaSyncTabs = ({
  param,
  values,
}: {
  param: string;
  values: {value: string; labelKey: string}[];
}): ListTabConfig[] =>
  values.map(({value, labelKey}) => ({
    value,
    labelKey,
    params: buildTabParams({param, value}),
  }));

export const HHA_SYNC_VIEW_TABS: ListTabConfig[] = Object.values(
  HHA_SYNC_VIEWS
).map(({value, labelKey}) => ({value, labelKey}));

export const HHA_SYNC_RUN_TABS: ListTabConfig[] = [ALL_TAB].concat(
  buildHhaSyncTabs({
    param: HHA_SYNC_FILTER_PARAMS.status,
    values: Object.entries(HHA_SYNC_RUN_STATUS).map(([value, chip]) => ({
      value,
      labelKey: chip.labelKey,
    })),
  })
);

export const HHA_SYNC_CHANGE_TABS: ListTabConfig[] = [ALL_TAB].concat(
  buildHhaSyncTabs({
    param: HHA_SYNC_FILTER_PARAMS.resource,
    values: Object.entries(HHA_SYNC_RESOURCES).map(([value, labelKey]) => ({
      value,
      labelKey,
    })),
  })
);

// Needing attention first, for the same reason as the exceptions worklist.
export const HHA_SYNC_EMAIL_CONFLICT_TABS: ListTabConfig[] = buildHhaSyncTabs({
  param: HHA_SYNC_FILTER_PARAMS.status,
  values: Object.values(HHA_EMAIL_CONFLICT_FILTERS),
}).concat([ALL_TAB]);

export const HHA_SYNC_COORDINATOR_TABS: ListTabConfig[] = buildHhaSyncTabs({
  param: HHA_SYNC_FILTER_PARAMS.choice,
  values: Object.values(HHA_COORDINATOR_CHOICE_FILTERS),
}).concat([ALL_TAB]);

// Open first: the worklist is what an admin comes here for.
export const HHA_SYNC_EXCEPTION_TABS: ListTabConfig[] = buildHhaSyncTabs({
  param: HHA_SYNC_FILTER_PARAMS.status,
  values: Object.entries(HHA_SYNC_EXCEPTION_STATUS).map(([value, chip]) => ({
    value,
    labelKey: chip.labelKey,
  })),
}).concat([ALL_TAB]);
