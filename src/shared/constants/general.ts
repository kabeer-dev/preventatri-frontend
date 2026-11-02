import {ORG_USER_SORT_FIELDS} from '@/shared/constants/orgUsers';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import translationUtilsValues from '@/shared/utils/translationsUtils';

import {FILTERS_CONFIG} from './reactQueryConstants';

export const BRANDING = async () => {
  const {t} = await translationUtilsValues();

  return {
    websiteName: t('mainPageTitle.appName'),
    websiteDescription: t('mainPageTitle.description'),
    faviconSvgPath: '/images/favicon.svg',
    faviconPath: '/images/favicon.png',
  };
};

export const LIST_TYPES = {
  users: {
    value: 'users',
    search: {
      keys: ['name', 'email'],
    },
    sort: {
      // Values are the dotted forms the roster endpoint validates against
      // (USERS_SORT_FIELDS_VALUES); the short column names are rejected.
      options: {
        firstName: {
          label: 'First Name',
          value: ORG_USER_SORT_FIELDS.firstName,
        },
        lastName: {
          label: 'Last Name',
          value: ORG_USER_SORT_FIELDS.lastName,
        },
        email: {
          label: 'Email',
          value: ORG_USER_SORT_FIELDS.email,
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.users.all(),
  },
  regions: {
    value: 'regions',
    search: {
      keys: ['name', 'code'],
    },
    sort: {
      options: {
        name: {
          label: 'Name',
          value: 'name',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.regions.all(),
  },
  patients: {
    value: 'patients',
    search: {
      keys: ['firstName', 'lastName'],
    },
    sort: {
      options: {
        firstName: {
          label: 'First Name',
          value: 'firstName',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.patients.all(),
  },
  assessmentChecklists: {
    value: 'templates',
    search: {
      keys: ['name', 'description'],
    },
    sort: {
      options: {
        name: {
          label: 'Name',
          value: 'title',
        },
        status: {
          label: 'Status',
          value: 'status',
        },
        createdAt: {
          label: 'Created At',
          value: 'createdAt',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.assessmentChecklists.all(),
  },
  submissions: {
    value: 'submissions',
    search: {
      keys: ['checklistName', 'patientName', 'caregiverName'],
    },
    sort: {
      options: {
        submittedAt: {
          label: 'Submitted At',
          value: 'submittedAt',
        },
        dueDate: {
          label: 'Due Date',
          value: 'dueDate',
        },
        status: {
          label: 'Status',
          value: 'status',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.submissions.all(),
  },
  hhaVisits: {
    value: 'hhaVisits',
    search: {
      keys: [
        'patientFirstName',
        'patientLastName',
        'caregiverFirstName',
        'caregiverLastName',
      ],
    },
    sort: {
      options: {
        visitDate: {
          label: 'Visit Date',
          value: 'visitDate',
        },
        scheduledStartAt: {
          label: 'Scheduled Start',
          value: 'scheduledStartAt',
        },
        status: {
          label: 'Status',
          value: 'status',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaVisits.all(),
  },
  syncRuns: {
    value: 'syncRuns',
    search: {keys: []},
    sort: {options: {}, directions: {}},
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaSync.all(),
  },
  syncChanges: {
    value: 'syncChanges',
    search: {keys: []},
    sort: {options: {}, directions: {}},
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaSync.all(),
  },
  syncExceptions: {
    value: 'syncExceptions',
    search: {keys: []},
    sort: {options: {}, directions: {}},
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaSync.all(),
  },
  emailConflicts: {
    value: 'emailConflicts',
    search: {keys: []},
    sort: {options: {}, directions: {}},
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaSync.all(),
  },
  coordinatorPatients: {
    value: 'coordinatorPatients',
    search: {keys: []},
    sort: {options: {}, directions: {}},
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.hhaSync.all(),
  },
  supervisoryVisits: {
    value: 'supervisoryVisits',
    search: {
      keys: ['search'],
    },
    sort: {
      options: {
        scheduledStartAt: {
          label: 'Scheduled',
          value: 'scheduledStartAt',
        },
        createdAt: {
          label: 'Created At',
          value: 'createdAt',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.supervisoryVisits.all(),
  },
  followUps: {
    value: 'followUps',
    search: {
      keys: ['search'],
    },
    sort: {
      options: {
        dueAt: {
          label: 'Due',
          value: 'dueAt',
        },
        createdAt: {
          label: 'Created At',
          value: 'createdAt',
        },
        title: {
          label: 'Task',
          value: 'title',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.followUps.all(),
  },
  emergencyFlags: {
    value: 'emergencyFlags',
    search: {
      keys: ['patientName', 'caregiverName'],
    },
    sort: {
      options: {
        createdAt: {
          label: 'Created At',
          value: 'createdAt',
        },
        reason: {
          label: 'Reason',
          value: 'reason',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.emergencyFlags.all(),
  },
  activityLog: {
    value: 'auditLogs',
    search: {
      keys: ['description'],
    },
    sort: {
      options: {
        timestamp: {
          label: 'Timestamp',
          value: 'timestamp',
        },
      },
      directions: {
        asc: {
          label: 'asc',
          value: 'asc',
        },
        desc: {
          label: 'desc',
          value: 'desc',
        },
      },
    },
    page: {
      number: FILTERS_CONFIG.number,
      limit: FILTERS_CONFIG.limit,
    },
    path: DASHBOARD_ROUTES.activityLog.all(),
  },
};

export const OTP_VIEW_TYPE = {
  page: {
    value: 'page',
  },
  modal: {
    value: 'modal',
  },
};

export const OTP_REGENERATE_TYPE = {
  public: {
    value: 'public',
  },
  private: {
    value: 'private',
  },
};

export const DEFAULT_LOGO = '/images/avatars/1.png';

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const ALLOWED_IMAGE_ACCEPT = ALLOWED_FILE_TYPES.join(', ');

export const ALLOWED_VISIT_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/heic',
  'image/heif',
];

export const ACTION_TAKEN_ATTACHMENT_TYPES = [
  // allow pdf and docx and .doc
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

// Action-taken attachments accept the visit attachment images plus PDF/Word docs.
export const ALLOWED_ACTION_TAKEN_ATTACHMENT_TYPES =
  ALLOWED_VISIT_ATTACHMENT_TYPES.concat(ACTION_TAKEN_ATTACHMENT_TYPES);

// Extension fallbacks so the picker and drag-and-drop still accept documents when
// the browser reports an empty or generic MIME type.
const ACTION_TAKEN_ATTACHMENT_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export const ALLOWED_VISIT_ATTACHMENT_ACCEPT =
  ALLOWED_VISIT_ATTACHMENT_TYPES.join(', ');

export const ALLOWED_ACTION_TAKEN_ATTACHMENT_ACCEPT =
  ALLOWED_ACTION_TAKEN_ATTACHMENT_TYPES.concat(
    ACTION_TAKEN_ATTACHMENT_EXTENSIONS
  ).join(', ');

export const MAX_VISIT_ATTACHMENTS_PER_QUESTION = 5;

export const MAX_AUDIO_RECORDING_SECONDS = 90;

export const AUDIO_MIME_TYPE = 'audio/webm' as const;

// These are the MIME types that are supported by the browser escpecially for safari which doesn't support 'audio/webm' but supports 'audio/mp4'
export const AUDIO_RECORDER_MIME_TYPES = [
  'audio/webm;codecs=opus',
  AUDIO_MIME_TYPE,
  'audio/mp4',
  'audio/mp4;codecs=mp4a.40.2',
] as const;

export type AudioRecorderMimeType = (typeof AUDIO_RECORDER_MIME_TYPES)[number];

// Backend-enum-aligned status values (uppercase). Use these when sending
// filters to the API (e.g. NurseStatus, RegionStatus, PatientStatus enums).
// For UI display (badges, dropdowns) use ACTIVE_STATUS from common.ts.
export const ENTITY_STATUS = {
  ACTIVE: {label: 'Active', value: 'ACTIVE'},
  INACTIVE: {label: 'Inactive', value: 'INACTIVE'},
} as const;

export const ENTITY_STATUS_OPTIONS = Object.values(ENTITY_STATUS).map(
  ({label, value}) => ({label, value})
);

export const ENTITY_STATUS_VALUES = Object.values(ENTITY_STATUS).map(
  ({value}) => value
);

// Page size used when a query needs to fetch all eligible records for a
// dropdown/selector rather than a paginated table.
export const DROPDOWN_PAGE_SIZE = 100;

// Page size for dropdowns that search on the server rather than loading every
// record up front; typing reaches whatever the first page does not show.
export const DROPDOWN_SEARCH_PAGE_SIZE = 20;

export const DROPDOWN_SEARCH_DEBOUNCE_MS = 400;

// Offset paging needs a fixed order; the list endpoints have none by default.
export const DROPDOWN_SORT = {
  byName: {sortBy: 'name', sortDir: 'asc'},
  byTitle: {sortBy: 'title', sortDir: 'asc'},
  byUserFirstName: {sortBy: 'user.firstName', sortDir: 'asc'},
  byLastName: {sortBy: 'lastName', sortDir: 'asc'},
} as const;

export const DROPDOWN_SCROLL_LOAD_THRESHOLD_PX = 40;

// Enough rows to overflow the 200px listbox, so it can scroll to load more.
export const DROPDOWN_MIN_VISIBLE_OPTIONS = 8;

// Shared URL query-param keys for table/list filters. Centralized so the same
// key string is reused across drawer hooks and page-local filters (and stays
// in sync with what the backend expects). Persisting these in the URL is what
// makes filter state survive back navigation / refresh (PREVENT-394).
export const FILTER_PARAMS = {
  patient: 'patientId',
  caregiver: 'submittedBy',
  caseManager: 'caseManagerProfileId',
  flag: 'flag',
  status: 'status',
  flagType: 'flagType',
  visitType: 'visitType',
  actionType: 'action',
  resourceType: 'resourceType',
  fromDate: 'fromDate',
  toDate: 'toDate',
  startDate: 'startDate',
  endDate: 'endDate',
  checklistType: 'type',
  source: 'source',
  assignee: 'assigneeUserOrganizationId',
  assigneeUser: 'assigneeUserId',
  priority: 'priority',
  region: 'regionId',
  nurseProfile: 'nurseProfileId',
  lastFlag: 'lastFlag',
  scheduledFrom: 'scheduledFrom',
  scheduledTo: 'scheduledTo',
} as const;

// "HH:mm" as typed into a time field.
export const TIME_INPUT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// "YYYY-MM-DD" as sent in date-only URL params.
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
