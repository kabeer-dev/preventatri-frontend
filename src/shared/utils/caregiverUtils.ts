import {HHA_MANAGED_CAREGIVER_PAYLOAD_FIELDS} from '@/shared/constants/caregivers';
import {Caregiver} from '@/shared/interfaces/caregiver';
import {CaregiverFormValues} from '@/shared/types/caregiver';
import {omitHhaManagedFields} from '@/shared/utils/hhaManagedFieldsUtils';

/**
 * Transforms a backend caregiver API response into the frontend Caregiver interface.
 * Flattens nested user fields and maps backend field names to frontend field names.
 */
export const transformCaregiverResponse = ({
  caregiver,
}: {
  caregiver: any;
}): Caregiver => {
  return {
    ...caregiver,
    id: caregiver.profileId || caregiver.id,
    firstName: caregiver.user?.firstName || caregiver.firstName,
    lastName: caregiver.user?.lastName || caregiver.lastName,
    email: caregiver.user?.email || caregiver.email,
    phoneNo: caregiver.user?.phoneNo || caregiver.phoneNo,
    isVerified: caregiver.user?.isVerified ?? caregiver.isVerified,
    caregiverRole: caregiver.role || caregiver.caregiverRole,
    language: caregiver.language,

    // Address lives on the nested user object — a CaregiverProfile is a User
    // satellite — and is flattened here like the other user fields above.
    address: caregiver.user?.address || caregiver.address,
    city: caregiver.user?.city || caregiver.city,
    state: caregiver.user?.state || caregiver.state,
    zipCode: caregiver.user?.zipCode || caregiver.zipCode,
    isPlaceholderEmail:
      caregiver.user?.isPlaceholderEmail ?? caregiver.isPlaceholderEmail,
    assignedPatients: caregiver.assignedPatientCount ?? 0,
    redFlags: caregiver.redFlagCount ?? 0,
  };
};

/**
 * Fields shared by the invite and update payloads.
 *
 * Extracted so the two builders cannot drift: they differed only in email
 * before, and every new caregiver field had to be remembered twice.
 */
const buildCaregiverSharedPayload = ({data}: {data: CaregiverFormValues}) => ({
  firstName: data.firstName,
  lastName: data.lastName,
  phoneNo: data.phoneNo,
  role: data.caregiverRole,
  status: data.status.toUpperCase(),
  relationshipToPatient: data.relationshipToPatient,
  preferredContactMethod: data.preferredContactMethod,
  language: data.language,
  notes: data.notes,
  address: data.address,
  city: data.city,
  state: data.state,
  zipCode: data.zipCode,
  startDate: data.startDate,
  terminationDate: data.terminationDate,
  onCallIndicator: data.onCallIndicator,
});

/**
 * Builds the invite payload for POST /caregivers/invite.
 * Maps frontend form fields to backend-expected field names.
 */
export const buildCaregiverInvitePayload = ({
  data,
}: {
  data: CaregiverFormValues;
}) => Object.assign(buildCaregiverSharedPayload({data}), {email: data.email});

/**
 * Builds the update payload for PATCH /caregivers/:id.
 *
 * Email is normally excluded — it is the login identity and is not editable
 * after invite. The ONE exception is an HHAeXchange caregiver still carrying
 * the synthetic placeholder address the sync minted because HHAeXchange had
 * none: without a way to replace it that account could never be invited. The
 * backend enforces the same rule, so sending it otherwise is simply rejected.
 *
 * For an HHA-sourced caregiver the fields HHAeXchange owns are dropped from the
 * payload entirely, leaving only what PreventaTri owns: relationship, preferred
 * contact, notes and on-call.
 */
export const buildCaregiverUpdatePayload = ({
  data,
  isHhaManaged = false,
  canEditEmail = false,
}: {
  data: CaregiverFormValues;
  isHhaManaged?: boolean;
  canEditEmail?: boolean;
}) => {
  // Managed keys are removed rather than merely disabled in the form: the
  // backend rejects on PRESENCE, and a disabled input still submits its value,
  // so leaving them in would 400 every edit to notes or on-call.
  const payload = omitHhaManagedFields({
    payload: buildCaregiverSharedPayload({data}),
    isHhaManaged,
    managedFields: HHA_MANAGED_CAREGIVER_PAYLOAD_FIELDS,
  });

  return canEditEmail
    ? Object.assign({}, payload, {email: data.email})
    : payload;
};
