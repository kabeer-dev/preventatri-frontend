import {HHA_MANAGED_CASE_MANAGER_PAYLOAD_FIELDS} from '@/shared/constants/caseManagers';
import {ACTIVE_STATUS} from '@/shared/constants/common';
import {PATIENT_SOURCE} from '@/shared/constants/patients';
import {
  CaseManager,
  CaseManagerAssignedPatient,
} from '@/shared/interfaces/caseManager';
import {
  CaseManagerFormPayload,
  CaseManagerFormValues,
} from '@/shared/types/caseManager';
import {omitHhaManagedFields} from '@/shared/utils/hhaManagedFieldsUtils';

/**
 * Transforms a backend case manager API response into the frontend CaseManager interface.
 * Flattens nested user fields and region objects to match the CaseManager shape.
 */
export const transformCaseManagerResponse = ({
  caseManager,
}: {
  caseManager: any;
}): CaseManager => {
  const regions = caseManager.regions || [];

  const patients = (caseManager.patients || []).map((p: any) => ({
    id: p.id,
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    source: p.source,
    flagStatus:
      p.redFlagCount >= 3 ? 'red' : p.redFlagCount >= 1 ? 'yellow' : 'green',
  }));

  // The form edits only the manual roster; HHA links come from the sync.
  const isHhaPatient = ({patient}: {patient: CaseManagerAssignedPatient}) =>
    patient.source === PATIENT_SOURCE.hhaExchange.value;

  return {
    ...caseManager,
    id: caseManager.profileId || caseManager.id,
    firstName: caseManager.user?.firstName || caseManager.firstName,
    lastName: caseManager.user?.lastName || caseManager.lastName,
    email: caseManager.user?.email || caseManager.email,
    phoneNo: caseManager.user?.phoneNo || caseManager.phoneNo,
    isVerified: caseManager.user?.isVerified ?? caseManager.isVerified,
    isPlaceholderEmail:
      caseManager.user?.isPlaceholderEmail ?? caseManager.isPlaceholderEmail,
    regionIds: regions.map((r: any) => r.id),
    regionNames: regions.map((r: any) => r.name).filter(Boolean),
    patientIds: patients
      .filter((p: CaseManagerAssignedPatient) => !isHhaPatient({patient: p}))
      .map((p: CaseManagerAssignedPatient) => p.id),
    assignedPatients: caseManager.assignedPatientsCount ?? patients.length,
    patients,
    hhaPatients: patients.filter((p: CaseManagerAssignedPatient) =>
      isHhaPatient({patient: p})
    ),
  };
};

/**
 * Builds the invite payload for POST /case-managers/invite.
 * Maps frontend form fields to backend-expected field names.
 */
export const buildCaseManagerInvitePayload = ({
  data,
}: {
  data: CaseManagerFormValues;
}) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phoneNo: data.phoneNo,
  regionIds: data.regionIds,
  status: data.status?.toUpperCase() || '',
  preferredContactMethod: data.preferredContactMethod,
  language: data.language || undefined,
  startDate: data.startDate || undefined,
  title: data.title || undefined,
  notes: data.notes,
  patientIds: data.patientIds?.length ? data.patientIds : undefined,
});

/**
 * Builds the update payload for PATCH /case-managers/:id.
 *
 * Only includes fields the backend accepts for update.
 *
 * For an HHA-sourced case manager the fields HHAeXchange owns are dropped from
 * the payload entirely, leaving what PreventaTri owns: phone, regions,
 * preferred contact, language, start date, notes and the patient roster.
 *
 * Email is normally excluded -- it is the login identity and is not editable
 * after invite. The ONE exception is an HHAeXchange case manager still carrying
 * the synthetic placeholder address the sync minted because HHAeXchange had
 * none: without a way to replace it that account could never be invited. The
 * backend enforces the same rule, so sending it otherwise is simply rejected.
 */
export const buildCaseManagerUpdatePayload = ({
  data,
  isHhaManaged = false,
  canEditEmail = false,
}: {
  data: CaseManagerFormValues;
  isHhaManaged?: boolean;
  canEditEmail?: boolean;
}) => {
  // Managed keys are removed rather than merely disabled in the form: the
  // backend rejects on PRESENCE, and a disabled input still submits its value,
  // so leaving them in would 400 every edit to regions or notes.
  const payload = omitHhaManagedFields({
    payload: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNo: data.phoneNo,
      regionIds: data.regionIds,
      status: data.status?.toUpperCase() || '',
      preferredContactMethod: data.preferredContactMethod,
      language: data.language || undefined,
      startDate: data.startDate || undefined,
      title: data.title || undefined,
      notes: data.notes,
      patientIds: data.patientIds,
    },
    isHhaManaged,
    managedFields: HHA_MANAGED_CASE_MANAGER_PAYLOAD_FIELDS,
  });

  return canEditEmail
    ? Object.assign({}, payload, {email: data.email})
    : payload;
};

/**
 * Manual patients that a submitted selection drops from the roster, so the
 * caller can warn before saving. HHA-linked patients are never in the form and
 * never dropped. Returns [] on an add-only change, an unchanged roster, or a
 * case manager being created.
 */
export const getUnassignedPatients = ({
  caseManager,
  patientIds,
}: {
  caseManager?: CaseManager | null;
  patientIds: string[];
}): CaseManagerAssignedPatient[] => {
  if (!caseManager?.patients?.length) return [];

  const hhaPatientIds = (caseManager.hhaPatients || []).map((p) => p.id);

  return caseManager.patients.filter(
    (patient) =>
      !hhaPatientIds.includes(patient.id) && !patientIds.includes(patient.id)
  );
};

/**
 * Generates form default values from a CaseManager entity for edit mode.
 */
export const generateCaseManagerFormDefaults = ({
  caseManager,
}: {
  caseManager: CaseManager;
}): CaseManagerFormPayload => ({
  firstName: caseManager.firstName || '',
  lastName: caseManager.lastName || '',
  email: caseManager.email || '',
  phoneNo: caseManager.phoneNo || '',
  regionIds: caseManager.regionIds || [],
  status: caseManager.status?.toLowerCase() || ACTIVE_STATUS.active.value,
  preferredContactMethod: caseManager.preferredContactMethod || '',
  language: caseManager.language || '',
  startDate: caseManager.startDate || null,
  title: caseManager.title || '',
  notes: caseManager.notes || '',
  patientIds: caseManager.patientIds || [],
});
