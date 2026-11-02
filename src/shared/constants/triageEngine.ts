import {
  TriageAlert,
  TriageFlagEnum,
  TriageFlagType,
} from '@/shared/interfaces/triageEngine';

import {DASHBOARD_ROUTES} from './paths';
import {FILTERS_CONFIG} from './reactQueryConstants';

// Raw backend flag colour enum values.
export const TRIAGE_FLAG_ENUM: Record<TriageFlagEnum, TriageFlagEnum> = {
  RED: 'RED',
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
};

// Raw backend flag type values: MANUAL = submitted by a caregiver,
// AUTO = captured by the triage engine.
export const TRIAGE_FLAG_TYPE: Record<TriageFlagType, TriageFlagType> = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
};

// Alert row title by severity × flag type: MANUAL flags are submitted by a
// caregiver, AUTO flags are captured by the triage engine.
export const TRIAGE_ALERT_TITLE_KEY: Record<TriageFlagType, string> = {
  MANUAL: 'triageEngine.alerts.items.manual',
  AUTO: 'triageEngine.alerts.items.auto',
};

// List config for the alerts panel, consumed by the shared
// useServerSideListFilters hook (same page/limit defaults as the app's other
// lists). `value` doubles as the response dataKey; the panel has no search UI,
// so search keys are empty.
export const TRIAGE_ALERTS_LIST_CONFIG = {
  value: 'alerts',
  search: {
    keys: [],
  },
  page: {
    number: FILTERS_CONFIG.number,
    limit: FILTERS_CONFIG.limit,
  },
};

// URL query-param prefix for the alerts panel's pagination state.
export const TRIAGE_ALERTS_URL_KEY_PREFIX = 'alerts';

// Destination for a clicked alert row. The routing axis is the alert type, not
// its colour: MANUAL alerts are caregiver-raised emergency flags (always stored
// as the same SubmissionFlag record with no submission linkage), so they open
// the emergency flag detail page keyed by the flag id. AUTO alerts are engine-
// captured flags linked to a checklist submission, so they open that
// submission's detail page keyed by submissionId.
export const getTriageAlertHref = ({alert}: {alert: TriageAlert}): string =>
  alert.type === TRIAGE_FLAG_TYPE.MANUAL
    ? DASHBOARD_ROUTES.emergencyFlags.single({id: alert.id})
    : DASHBOARD_ROUTES.submissions.single({id: alert.submissionId ?? alert.id});
