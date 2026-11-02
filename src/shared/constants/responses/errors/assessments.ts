// Escalation resolve error types returned by the backend (see
// factories/errors/assessments.js). The resolve endpoint rejects with one of
// these when the flag is no longer this user's to act on — used to clear the
// now-stale flag popup instead of leaving it on screen.
export const ASSESSMENT_ERRORS_TYPES = {
  escalationNotFound: {
    value: 'ESCALATION_NOT_FOUND',
  },
  escalationAlreadyResolved: {
    value: 'ESCALATION_ALREADY_RESOLVED',
  },
  escalationExpired: {
    value: 'ESCALATION_EXPIRED',
  },

  // Accept only: the flag was already accepted, resolved or voided, or it sits
  // at the last step.
  escalationNotAcceptable: {
    value: 'ESCALATION_NOT_ACCEPTABLE',
  },
};

// Accept errors that mean the flag on screen is out of date (see
// STALE_FLAG_ERROR_TYPES), plus the accept-only refusal.
export const STALE_ACCEPT_ERROR_TYPES = [
  ASSESSMENT_ERRORS_TYPES.escalationExpired.value,
  ASSESSMENT_ERRORS_TYPES.escalationNotFound.value,
  ASSESSMENT_ERRORS_TYPES.escalationNotAcceptable.value,
];

// Resolve errors that mean this flag is no longer the caller's to act on: the
// window elapsed and it moved to the next level, someone else already resolved
// it, or it's gone. In all three the popup on screen is stale, so we refresh the
// flag lists (dropping it) and close the modal instead of leaving it stuck.
export const STALE_FLAG_ERROR_TYPES = [
  ASSESSMENT_ERRORS_TYPES.escalationExpired.value,
  ASSESSMENT_ERRORS_TYPES.escalationAlreadyResolved.value,
  ASSESSMENT_ERRORS_TYPES.escalationNotFound.value,
];
