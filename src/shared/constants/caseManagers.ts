import {ENTITY_SOURCE} from '@/shared/constants/common';
import {CaseManagerFormPayload} from '@/shared/types/caseManager';

import {ACTIVE_STATUS} from './common';

/**
 * Where a case manager record came from.
 *
 * Mirrors CASE_MANAGER_SOURCES on the backend and the CaseManagerSource
 * Postgres enum. HHAeXchange calls the role a Coordinator; the label here stays
 * "HHAeXchange" because product copy says "Case Manager" everywhere and
 * "Coordinator" never reaches a screen.
 */
export const CASE_MANAGER_SOURCE = ENTITY_SOURCE;

/**
 * Fields HHAeXchange owns on an imported case manager, named as they appear in
 * the API PAYLOAD.
 *
 * Mirrors HHA_MANAGED_CASE_MANAGER_FIELDS on the backend, which rejects a
 * payload containing any of them for an HHA-sourced case manager -- and rejects
 * on PRESENCE, not on change. Disabled inputs still submit their values through
 * react-hook-form, so the update payload must have these keys stripped out
 * entirely; without that, editing a case manager's notes would 400 on fields the
 * user never touched.
 *
 * Much shorter than the caregiver list because GetCoordinators publishes far
 * less, and only the name and the active flag are synced. title, phoneNo,
 * regionIds, patientIds, preferredContactMethod, language, startDate and notes
 * are all PreventaTri-owned and stay editable -- which is the whole point of
 * the admin review an imported case manager waits for.
 *
 * `email` is absent on purpose -- it follows HHAeXchange when HHA has one, and
 * stays editable while it is still the generated placeholder.
 */
export const HHA_MANAGED_CASE_MANAGER_PAYLOAD_FIELDS = [
  'firstName',
  'lastName',
  'status',
];

// Default values for display
export const CASE_MANAGER_DEFAULTS = {
  assignedPatients: 0,
  lastLogin: 'Never',
  status: ACTIVE_STATUS.inactive.value,
} as const;

// Blank add/edit form state, also used to clear the modal on close
export const CASE_MANAGER_FORM_DEFAULTS: CaseManagerFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  regionIds: [],
  status: ACTIVE_STATUS.active.value,
  preferredContactMethod: '',
  language: '',
  startDate: null,
  title: '',
  notes: '',
  patientIds: [],
};
