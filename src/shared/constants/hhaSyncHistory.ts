import {ThemeColor} from '@/@core/theme/types';
import {DATE_ONLY_ZONE} from '@/shared/constants/common';
import {
  HhaSyncChip,
  HhaSyncExceptionTypeMeta,
  HhaSyncFixIn,
  HhaSyncLinkConflict,
  HhaSyncResourceTimelineEntry,
} from '@/shared/interfaces/hhaSyncHistory';

// Raw values come from the API; labels and colours are resolved here only.

export const HHA_SYNC_VIEWS = {
  runs: {value: 'runs', labelKey: 'hhaSyncHistory.views.runs'},
  changes: {value: 'changes', labelKey: 'hhaSyncHistory.views.changes'},
  exceptions: {
    value: 'exceptions',
    labelKey: 'hhaSyncHistory.views.exceptions',
  },
  emails: {value: 'emails', labelKey: 'hhaSyncHistory.views.emails'},
  coordinators: {
    value: 'coordinators',
    labelKey: 'hhaSyncHistory.views.coordinators',
  },
} as const;

// Each view keeps its own URL state, so switching views never carries a page
// number or tab from one list into another.
export const HHA_SYNC_URL_KEYS = {
  view: 'view',
  runStatus: 'runStatus',
  changeResource: 'changeResource',
  exceptionStatus: 'exceptionStatus',
  emailStatus: 'emailStatus',
  coordinatorChoice: 'coordinatorChoice',
  runsPrefix: 'runs',
  changesPrefix: 'changes',
  exceptionsPrefix: 'exceptions',
  emailsPrefix: 'emails',
  coordinatorsPrefix: 'coordinators',
} as const;

export const HHA_SYNC_FILTER_PARAMS = {
  status: 'status',
  resource: 'resource',
  action: 'action',
  type: 'type',
  choice: 'choice',
} as const;

export const HHA_SYNC_RUN_STATUS: Record<string, HhaSyncChip> = {
  RUNNING: {labelKey: 'hhaSyncHistory.runStatuses.running', color: 'info'},
  SUCCEEDED: {
    labelKey: 'hhaSyncHistory.runStatuses.succeeded',
    color: 'success',
  },
  WITH_EXCEPTIONS: {
    labelKey: 'hhaSyncHistory.runStatuses.withExceptions',
    color: 'warning',
  },
  PARTIAL: {labelKey: 'hhaSyncHistory.runStatuses.partial', color: 'warning'},
  FAILED: {labelKey: 'hhaSyncHistory.runStatuses.failed', color: 'error'},
  ABANDONED: {
    labelKey: 'hhaSyncHistory.runStatuses.abandoned',
    color: 'secondary',
  },
};

// A resource's own outcome reuses the run chips.
export const HHA_SYNC_RESOURCE_OUTCOME = {
  succeeded: 'SUCCEEDED',
  withExceptions: 'WITH_EXCEPTIONS',
  failed: 'FAILED',
} as const;

export const HHA_SYNC_TRIGGER_LABEL_KEYS: Record<string, string> = {
  SCHEDULED: 'hhaSyncHistory.triggers.scheduled',
  MANUAL: 'hhaSyncHistory.triggers.manual',
};

export const HHA_SYNC_RESOURCES = {
  COORDINATORS: 'hhaSyncHistory.resources.caseManagers',
  NURSES: 'hhaSyncHistory.resources.nurses',
  CAREGIVERS: 'hhaSyncHistory.resources.caregivers',
  PATIENTS: 'hhaSyncHistory.resources.patients',
  VISITS: 'hhaSyncHistory.resources.visits',
} as const;

export const HHA_SYNC_CHANGE_ACTION: Record<string, HhaSyncChip> = {
  CREATED: {labelKey: 'hhaSyncHistory.actions.created', color: 'success'},
  UPDATED: {labelKey: 'hhaSyncHistory.actions.updated', color: 'info'},
  LINK_CHANGED: {
    labelKey: 'hhaSyncHistory.actions.linkChanged',
    color: 'primary',
  },
  EMAIL_CHANGED: {
    labelKey: 'hhaSyncHistory.actions.emailChanged',
    color: 'primary',
  },
  ADOPTED: {labelKey: 'hhaSyncHistory.actions.adopted', color: 'primary'},
  RECLASSIFIED: {
    labelKey: 'hhaSyncHistory.actions.reclassified',
    color: 'warning',
  },
  PURGED: {labelKey: 'hhaSyncHistory.actions.purged', color: 'warning'},
  DELETED_IN_HHA: {
    labelKey: 'hhaSyncHistory.actions.deletedInHha',
    color: 'secondary',
  },
};

// A created record has no "before", so its fields show the new value alone.
export const HHA_SYNC_CREATED_ACTION = 'CREATED';

export const HHA_SYNC_EXCEPTION_STATUS: Record<string, HhaSyncChip> = {
  OPEN: {labelKey: 'hhaSyncHistory.exceptionStatuses.open', color: 'error'},
  RESOLVED: {
    labelKey: 'hhaSyncHistory.exceptionStatuses.resolved',
    color: 'success',
  },
  DISMISSED: {
    labelKey: 'hhaSyncHistory.exceptionStatuses.dismissed',
    color: 'secondary',
  },
  AUTO_RESOLVED: {
    labelKey: 'hhaSyncHistory.exceptionStatuses.autoResolved',
    color: 'success',
  },
};

// The statuses an admin may set; AUTO_RESOLVED belongs to the sync alone.
export const HHA_SYNC_EXCEPTION_ADMIN_STATUS = {
  open: 'OPEN',
  resolved: 'RESOLVED',
  dismissed: 'DISMISSED',
} as const;

export const HHA_SYNC_FIX_IN_CHIP: Record<string, HhaSyncChip> = {
  hha: {labelKey: 'hhaSyncHistory.fixIn.hha', color: 'warning'},
  preventatri: {labelKey: 'hhaSyncHistory.fixIn.preventatri', color: 'info'},
  dev: {labelKey: 'hhaSyncHistory.fixIn.dev', color: 'error'},
  none: {labelKey: 'hhaSyncHistory.fixIn.none', color: 'secondary'},
};

// Only HHA fixes need a sync to close; dev and "none" have nothing to fix.
export const HHA_SYNC_AFTER_FIX: Partial<Record<HhaSyncFixIn, string>> = {
  hha: 'hhaSyncHistory.exceptions.detail.afterFixSteps.hha',
  preventatri: 'hhaSyncHistory.exceptions.detail.afterFixSteps.preventatri',
};

export const HHA_SYNC_FIX_TARGETS = {
  record: 'record',
  relatedUser: 'relatedUser',
} as const;

const meta = ({
  fixIn,
  fixTarget = null,
}: {
  fixIn: HhaSyncExceptionTypeMeta['fixIn'];
  fixTarget?: HhaSyncExceptionTypeMeta['fixTarget'];
}): HhaSyncExceptionTypeMeta => ({fixIn, fixTarget});

/** Where each exception is fixed (from docs/hha-sync-decisions.md, section 2). */
export const HHA_SYNC_EXCEPTION_TYPES: Record<
  string,
  HhaSyncExceptionTypeMeta
> = {
  MISSING_PATIENT_ID: meta({fixIn: 'hha'}),
  MISSING_REQUIRED_FIELD: meta({fixIn: 'hha'}),
  UNMAPPED_STATUS_ID: meta({fixIn: 'hha'}),
  UNMAPPED_GENDER: meta({fixIn: 'hha'}),
  ARCHIVED_PATIENT_UPDATED: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  UPSERT_FAILED: meta({fixIn: 'dev'}),

  // The ZIP is HHA data; setting the county here is only a stop-gap.
  MISSING_COUNTY_ZIP: meta({fixIn: 'hha', fixTarget: 'record'}),
  UNRESOLVED_COUNTY_ZIP: meta({fixIn: 'hha', fixTarget: 'record'}),
  COUNTY_NOT_IN_ORGANIZATION: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  OUT_OF_STATE_ZIP: meta({fixIn: 'none', fixTarget: 'record'}),
  ZIP_STATE_MISMATCH: meta({fixIn: 'hha', fixTarget: 'record'}),
  PATIENT_NURSE_ELEMENT_MISSING: meta({fixIn: 'dev'}),
  PATIENT_COORDINATOR_ELEMENT_MISSING: meta({fixIn: 'dev'}),
  UNKNOWN_HHA_NURSE: meta({fixIn: 'hha', fixTarget: 'record'}),
  NO_HHA_COORDINATOR: meta({fixIn: 'hha', fixTarget: 'record'}),
  UNKNOWN_COORDINATOR_NAME: meta({fixIn: 'hha', fixTarget: 'record'}),
  AMBIGUOUS_COORDINATOR_NAME: meta({fixIn: 'hha', fixTarget: 'record'}),
  CASE_MANAGER_ARCHIVED: meta({fixIn: 'hha', fixTarget: 'record'}),
  SECONDARY_NURSE_MATCHES_PRIMARY: meta({
    fixIn: 'preventatri',
    fixTarget: 'record',
  }),
  SECONDARY_NURSE_REGION_MISMATCH: meta({
    fixIn: 'preventatri',
    fixTarget: 'record',
  }),
  LINK_LOOKUP_FAILED: meta({fixIn: 'none'}),
  MISSING_CAREGIVER_ID: meta({fixIn: 'hha'}),
  MISSING_DISCIPLINE: meta({fixIn: 'hha', fixTarget: 'record'}),
  UNMAPPED_CAREGIVER_STATUS: meta({fixIn: 'hha', fixTarget: 'record'}),
  UNMAPPED_LANGUAGE: meta({fixIn: 'hha', fixTarget: 'record'}),
  ARCHIVED_CAREGIVER_UPDATED: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  MISSING_COORDINATOR_ID: meta({fixIn: 'hha'}),
  UNMAPPED_COORDINATOR_STATUS: meta({fixIn: 'hha', fixTarget: 'record'}),
  ARCHIVED_CASE_MANAGER_UPDATED: meta({
    fixIn: 'preventatri',
    fixTarget: 'record',
  }),
  UNMAPPED_PROFESSIONAL_ROLE: meta({fixIn: 'hha', fixTarget: 'record'}),
  UNMAPPED_NURSE_STATUS: meta({fixIn: 'hha', fixTarget: 'record'}),
  INVALID_NPI: meta({fixIn: 'hha', fixTarget: 'record'}),
  ARCHIVED_NURSE_UPDATED: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  NURSE_DEMOGRAPHICS_UNAVAILABLE: meta({fixIn: 'none'}),
  NURSE_ROSTER_UNAVAILABLE: meta({fixIn: 'none'}),
  CAREGIVER_RECLASSIFIED_AS_NURSE: meta({fixIn: 'none', fixTarget: 'record'}),
  SELECTED_COORDINATOR_REMOVED: meta({
    fixIn: 'preventatri',
    fixTarget: 'record',
  }),
  PRIMARY_NURSE_CONFLICT: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  CASE_MANAGER_CONFLICT: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  NURSE_INVITATION_PENDING: meta({
    fixIn: 'preventatri',
    fixTarget: 'relatedUser',
  }),
  CASE_MANAGER_INVITATION_PENDING: meta({
    fixIn: 'preventatri',
    fixTarget: 'relatedUser',
  }),
  NURSE_NOT_ACTIVE: meta({fixIn: 'hha', fixTarget: 'relatedUser'}),
  CASE_MANAGER_NOT_ACTIVE: meta({fixIn: 'hha', fixTarget: 'relatedUser'}),
  DUPLICATE_EMAIL: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  EMAIL_IN_USE: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  INVALID_EMAIL: meta({fixIn: 'hha', fixTarget: 'record'}),
  HHA_EMAIL_CHANGED: meta({fixIn: 'preventatri', fixTarget: 'record'}),
  MISSING_VISIT_ID: meta({fixIn: 'hha'}),
  UNMAPPED_MISSED_REASON: meta({fixIn: 'dev'}),
  UNMAPPED_MISSED_VISIT: meta({fixIn: 'dev'}),
  UNMAPPED_TIMEZONE: meta({fixIn: 'dev'}),
  UNMAPPED_VISIT_TYPE: meta({fixIn: 'dev'}),
  CURSOR_WINDOW_GUARD: meta({fixIn: 'dev'}),
};

export const HHA_SYNC_UNKNOWN_EXCEPTION_TYPE = meta({fixIn: 'dev'});

// Closed only by choosing a nurse: a plain resolve or dismiss would not record the choice.
export const HHA_SYNC_NURSE_CONFLICT_TYPE = 'PRIMARY_NURSE_CONFLICT';

export const HHA_SYNC_CASE_MANAGER_CONFLICT_TYPE = 'CASE_MANAGER_CONFLICT';

/**
 * The two conflicts an admin closes by choosing who stays on the patient.
 * `copyKey` is their block under hhaSyncHistory.exceptions.conflicts.
 */
export const HHA_SYNC_LINK_CONFLICTS: Record<string, HhaSyncLinkConflict> = {
  [HHA_SYNC_NURSE_CONFLICT_TYPE]: {
    copyKey: 'nurse',
    holderField: 'preventatriNurse',
  },
  [HHA_SYNC_CASE_MANAGER_CONFLICT_TYPE]: {
    copyKey: 'caseManager',
    holderField: 'preventatriCaseManager',
  },
};

// One row per person: nobody is linked to their patients until they are active.
export const HHA_SYNC_INVITATION_PENDING_TYPES = [
  'NURSE_INVITATION_PENDING',
  'CASE_MANAGER_INVITATION_PENDING',
];

export const HHA_SYNC_WAITING_PERSON_TYPES =
  HHA_SYNC_INVITATION_PENDING_TYPES.concat([
    'NURSE_NOT_ACTIVE',
    'CASE_MANAGER_NOT_ACTIVE',
  ]);

// Why a waiting person cannot be invited yet, by invitation status; the keys
// sit under hhaSyncHistory.exceptions.invite.blocked.
export const HHA_SYNC_INVITE_BLOCKED_KEYS: Record<string, string> = {
  PENDING_REVIEW: 'needsEmail',
  CONFLICT: 'needsEmail',
  INVITED: 'alreadyInvited',
};

export const HHA_SYNC_INVITE_BLOCKED_FALLBACK_KEY = 'other';

// Patients listed under a waiting person: the most one list request returns.
export const HHA_SYNC_WAITING_PATIENTS_LIMIT = 100;

// The list scrolls inside the dialog instead of pushing its actions off screen.
export const HHA_SYNC_WAITING_PATIENTS_MAX_HEIGHT = 240;

// The one exception an admin can answer in place, by adding the county to a region.
export const HHA_SYNC_COUNTY_NOT_SET_UP_TYPE = 'COUNTY_NOT_IN_ORGANIZATION';

export const HHA_LINK_CONFLICT_CHOICE = {
  preventatri: 'PREVENTATRI',
  hha: 'HHA',
} as const;

// Where one person stands in a group sharing an HHAeXchange address.
export const HHA_EMAIL_CONFLICT_STATE: Record<string, HhaSyncChip> = {
  USES_EMAIL: {
    labelKey: 'hhaSyncHistory.emails.states.usesEmail',
    color: 'success',
  },
  NEEDS_EMAIL: {
    labelKey: 'hhaSyncHistory.emails.states.needsEmail',
    color: 'error',
  },
  ADMIN_SET: {
    labelKey: 'hhaSyncHistory.emails.states.adminSet',
    color: 'info',
  },
  OTHER_EMAIL: {
    labelKey: 'hhaSyncHistory.emails.states.otherEmail',
    color: 'warning',
  },
  NOT_IMPORTED: {
    labelKey: 'hhaSyncHistory.emails.states.notImported',
    color: 'error',
  },
  EMAIL_SAVED: {
    labelKey: 'hhaSyncHistory.emails.states.emailSaved',
    color: 'info',
  },
};

export const HHA_EMAIL_CONFLICT_FILTERS = {
  needsAttention: {
    value: 'needsAttention',
    labelKey: 'hhaSyncHistory.emails.filters.needsAttention',
  },
  resolved: {
    value: 'resolved',
    labelKey: 'hhaSyncHistory.emails.filters.resolved',
  },
} as const;

export const HHA_COORDINATOR_CHOICE_FILTERS = {
  needsChoice: {
    value: 'needsChoice',
    labelKey: 'hhaSyncHistory.coordinators.filters.needsChoice',
  },
  chosen: {
    value: 'chosen',
    labelKey: 'hhaSyncHistory.coordinators.filters.chosen',
  },
} as const;

export const HHA_RECORD_KIND_LABEL_KEYS: Record<string, string> = {
  nurse: 'hhaSyncHistory.kinds.nurse',
  caregiver: 'hhaSyncHistory.kinds.caregiver',
  caseManager: 'hhaSyncHistory.kinds.caseManager',
  user: 'hhaSyncHistory.kinds.user',
};

export const HHA_SYNC_PATIENT_KIND = 'patient';

// Person, state chip, actions: fixed widths so every row lines up.
export const HHA_EMAIL_MEMBER_GRID_COLUMNS = 'minmax(0, 1fr) 190px 290px';

// An admin gave this person their own email, so they can be invited from here.
export const HHA_EMAIL_ADMIN_SET_STATE = 'ADMIN_SET';

// What each HHAeXchange coordinator of a patient is in PreventaTri.
export const HHA_COORDINATOR_STATUS: Record<string, HhaSyncChip> = {
  caseManager: {
    labelKey: 'hhaSyncHistory.coordinators.caseManager',
    color: 'success',
  },
  archived: {
    labelKey: 'hhaSyncHistory.coordinators.archived',
    color: 'warning',
  },
  notActive: {
    labelKey: 'hhaSyncHistory.coordinators.notActive',
    color: 'warning',
  },
  notSynced: {
    labelKey: 'hhaSyncHistory.coordinators.notSynced',
    color: 'warning',
  },
};

// Rows grow with their members, so the grid measures them.
export const HHA_SYNC_AUTO_ROW_HEIGHT = 'auto';

export const HHA_SYNC_EMAIL_MAX_LENGTH = 255;

// Field labels of the Changes list; anything unlisted shows its raw name.
export const HHA_SYNC_FIELD_LABEL_KEYS: Record<string, string> = {
  countyId: 'hhaSyncHistory.fields.county',
  primaryNurseProfileId: 'hhaSyncHistory.fields.primaryNurse',
  secondaryNurseProfileId: 'hhaSyncHistory.fields.secondaryNurse',
  caseManagerProfileId: 'hhaSyncHistory.fields.caseManager',
  primaryRegionIds: 'hhaSyncHistory.fields.primaryRegion',
  userId: 'hhaSyncHistory.fields.user',
  caregiverProfileId: 'hhaSyncHistory.fields.caregiverProfile',
  email: 'hhaSyncHistory.fields.email',
  firstName: 'hhaSyncHistory.fields.firstName',
  lastName: 'hhaSyncHistory.fields.lastName',
  dateOfBirth: 'hhaSyncHistory.fields.dateOfBirth',
  status: 'hhaSyncHistory.fields.status',
  address: 'hhaSyncHistory.fields.address',
  city: 'hhaSyncHistory.fields.city',
  state: 'hhaSyncHistory.fields.state',
  zipCode: 'hhaSyncHistory.fields.zipCode',
  phoneNo: 'hhaSyncHistory.fields.phone',
  gender: 'hhaSyncHistory.fields.gender',
  medicaidId: 'hhaSyncHistory.fields.medicaidId',
  emergencyContact: 'hhaSyncHistory.fields.emergencyContact',
  role: 'hhaSyncHistory.fields.role',
  language: 'hhaSyncHistory.fields.language',
  startDate: 'hhaSyncHistory.fields.startDate',
  terminationDate: 'hhaSyncHistory.fields.terminationDate',
  professionalRole: 'hhaSyncHistory.fields.professionalRole',
  licenseNumber: 'hhaSyncHistory.fields.licenseNumber',
  npi: 'hhaSyncHistory.fields.npi',
  hhaPatientId: 'hhaSyncHistory.fields.hhaPatientId',
  hhaCaregiverId: 'hhaSyncHistory.fields.hhaCaregiverId',
  patientFirstName: 'hhaSyncHistory.fields.patientFirstName',
  patientLastName: 'hhaSyncHistory.fields.patientLastName',
  caregiverFirstName: 'hhaSyncHistory.fields.caregiverFirstName',
  caregiverLastName: 'hhaSyncHistory.fields.caregiverLastName',
  visitDate: 'hhaSyncHistory.fields.visitDate',
  visitType: 'hhaSyncHistory.fields.visitType',
  timeZone: 'hhaSyncHistory.fields.timeZone',
  scheduledStartAt: 'hhaSyncHistory.fields.scheduledStartAt',
  scheduledEndAt: 'hhaSyncHistory.fields.scheduledEndAt',
  scheduleDurationMinutes: 'hhaSyncHistory.fields.scheduleDurationMinutes',
  actualStartAt: 'hhaSyncHistory.fields.actualStartAt',
  actualEndAt: 'hhaSyncHistory.fields.actualEndAt',
  evvStartAt: 'hhaSyncHistory.fields.evvStartAt',
  evvEndAt: 'hhaSyncHistory.fields.evvEndAt',
  clockInEvvType: 'hhaSyncHistory.fields.clockInEvvType',
  clockOutEvvType: 'hhaSyncHistory.fields.clockOutEvvType',
  isMissedVisit: 'hhaSyncHistory.fields.isMissedVisit',
  missedReasonId: 'hhaSyncHistory.fields.missedReasonId',
  missedReason: 'hhaSyncHistory.fields.missedReason',
};

export const HHA_SYNC_DATE_TIME_FORMAT = 'dd MMM yyyy, h:mm a';

export const HHA_SYNC_DATE_FORMAT = 'dd MMM yyyy';

// Change values arrive as ISO strings; a date-only field is UTC midnight.
export const HHA_SYNC_ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const HHA_SYNC_UTC_MIDNIGHT_SUFFIX = 'T00:00:00.000Z';

// Read a date-only value in UTC so no viewer zone shifts it a day.
export const HHA_SYNC_DATE_ONLY_ZONE = DATE_ONLY_ZONE;

export const HHA_SYNC_ARROW = '→';

export const HHA_SYNC_NOTE_MAX_LENGTH = 500;

export const HHA_SYNC_DIALOG_WIDTH = 640;

export const HHA_SYNC_TIMELINE_DOT: Record<string, ThemeColor> = {
  start: 'info',
  succeeded: 'success',
  withExceptions: 'warning',
  failed: 'error',
};

// Timeline entry of one resource, by HHA_SYNC_RESOURCE_OUTCOME value.
export const HHA_SYNC_RESOURCE_TIMELINE: Record<
  string,
  HhaSyncResourceTimelineEntry
> = {
  [HHA_SYNC_RESOURCE_OUTCOME.succeeded]: {
    titleKey: 'hhaSyncHistory.runs.detail.resourceDone',
    dotColor: HHA_SYNC_TIMELINE_DOT.succeeded,
  },
  [HHA_SYNC_RESOURCE_OUTCOME.withExceptions]: {
    titleKey: 'hhaSyncHistory.runs.detail.resourceDoneWithExceptions',
    dotColor: HHA_SYNC_TIMELINE_DOT.withExceptions,
  },
  [HHA_SYNC_RESOURCE_OUTCOME.failed]: {
    titleKey: 'hhaSyncHistory.runs.detail.resourceFailed',
    dotColor: HHA_SYNC_TIMELINE_DOT.failed,
  },
};
