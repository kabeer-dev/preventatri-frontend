import {ThemeColor} from '@/@core/theme/types';
import {ACTIVE_STATUS, SYSTEM_ROLES} from '@/shared/constants/common';
import {
  HHA_DERIVED_NURSE_PAYLOAD_FIELDS,
  DEFAULT_LICENSE_STATE,
  HHA_MANAGED_NURSE_PAYLOAD_FIELDS,
  LICENSE_STATE_OPTIONS,
  NURSE_SOURCE,
  RESP_TIME_CHIP_BANDS,
  RESP_TIME_EMPTY_COLOR,
} from '@/shared/constants/nurses';
import {Nurse} from '@/shared/interfaces/nurse';
import {RegionNurseRef} from '@/shared/interfaces/region';
import {NurseFormPayload, NurseFormValues} from '@/shared/types/nurse';
import {getFullName} from '@/shared/utils/general';
import {
  buildHhaManagedFields,
  omitHhaManagedFields,
} from '@/shared/utils/hhaManagedFieldsUtils';

export const getLicenseStateLabel = ({stateCode}: {stateCode?: string}) =>
  LICENSE_STATE_OPTIONS.find((option) => option.value === stateCode)?.label ||
  stateCode;

export const joinNurseNames = ({
  nurses,
}: {
  nurses: RegionNurseRef[] | null | undefined;
}): string => {
  const names = (nurses || [])
    .map((nurse) =>
      getFullName({
        firstName: nurse.user?.firstName,
        lastName: nurse.user?.lastName,
      })
    )
    .filter(Boolean);

  return names.join(', ');
};

/**
 * Resolves the AVG RESP TIME chip's color from RESP_TIME_CHIP_BANDS: the first
 * band the average falls within wins, so a nurse averaging inside the RED SLA
 * reads green while a slow one reads red. A null/undefined average (they have
 * never resolved an escalation) gets the neutral empty color rather than being
 * scored.
 */
export const resolveRespTimeChipColor = ({
  seconds,
}: {
  seconds: number | null | undefined;
}): ThemeColor => {
  if (seconds === null || seconds === undefined) return RESP_TIME_EMPTY_COLOR;

  const band = RESP_TIME_CHIP_BANDS.find(
    ({maxSeconds}) => seconds <= maxSeconds
  );

  return band?.color || RESP_TIME_EMPTY_COLOR;
};

/**
 * Whether HHAeXchange owns this nurse's managed fields. Null-safe so callers
 * can pass the currently selected nurse straight through.
 */
export const isHhaManagedNurse = ({nurse}: {nurse?: Nurse | null}): boolean =>
  nurse?.source === NURSE_SOURCE.hhaExchange.value;

/**
 * The sole exception to the HHAeXchange lock: an imported nurse for whom
 * HHAeXchange had no email carries a generated placeholder, and replacing it
 * is the only way they can ever be invited.
 */
export const canEditNurseEmail = ({nurse}: {nurse?: Nurse | null}): boolean =>
  isHhaManagedNurse({nurse}) && Boolean(nurse?.isPlaceholderEmail);

/**
 * Transforms a backend nurse API response into the frontend Nurse interface.
 * Flattens nested user fields and region objects to match the Nurse shape.
 */
export const transformNurseResponse = ({nurse}: {nurse: any}): Nurse => {
  const primaryRegions = nurse.primaryRegions || [];
  const secondaryRegions = nurse.secondaryRegions || [];

  return {
    ...nurse,
    id: nurse.profileId || nurse.id,
    firstName: nurse.user?.firstName || nurse.firstName,
    lastName: nurse.user?.lastName || nurse.lastName,
    email: nurse.user?.email || nurse.email,
    phoneNo: nurse.user?.phoneNo || nurse.phoneNo,
    address: nurse.user?.address || nurse.address,
    city: nurse.user?.city || nurse.city,
    state: nurse.user?.state || nurse.state,
    zipCode: nurse.user?.zipCode || nurse.zipCode,
    isVerified: nurse.user?.isVerified ?? nurse.isVerified,
    isPlaceholderEmail:
      nurse.user?.isPlaceholderEmail ?? nurse.isPlaceholderEmail,
    primaryRegionIds: primaryRegions.map((r: any) => r.id) || [],
    secondaryRegionIds: secondaryRegions.map((r: any) => r.id) || [],
    primaryRegionNames: primaryRegions.map((r: any) => r.name).filter(Boolean),
    secondaryRegionNames: secondaryRegions
      .map((r: any) => r.name)
      .filter(Boolean),
    currentPatientCount: nurse.constraint?.currentPatientCount ?? 0,
  };
};

/**
 * Builds the update payload for PATCH /nurses/:id.
 *
 * Only includes fields the backend accepts for update. On an HHAeXchange nurse
 * the managed keys (plus primary regions while HHA-derived) are removed rather
 * than merely disabled in the form: the backend rejects on PRESENCE, and a
 * disabled input still submits its value. Email is sent only while it is still
 * the generated placeholder -- see canEditNurseEmail.
 */
export const buildNurseUpdatePayload = ({
  data,
  nurse = null,
}: {
  data: NurseFormValues;
  nurse?: Nurse | null;
}) => {
  const payload = omitHhaManagedFields({
    payload: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNo: data.phoneNo,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      professionalRole: data.professionalRole,
      licenseNumber: data.licenseNumber || null,
      licenseState: data.licenseState,
      licenseExpirationDate: data.licenseExpirationDate || null,
      status: data.status.toUpperCase(),
      npi: data.npi,
      onCallIndicator: data.onCallIndicator,
      preferredContactMethod: data.preferredContactMethod,
      joiningDate: data.joiningDate,
      notes: data.notes,
      primaryRegionIds: data.primaryRegionIds,
      secondaryRegionIds: data.secondaryRegionIds,
    },
    isHhaManaged: isHhaManagedNurse({nurse}),
    managedFields: buildHhaManagedFields({
      baseFields: HHA_MANAGED_NURSE_PAYLOAD_FIELDS,
      conditionalFields: [
        {
          fields: HHA_DERIVED_NURSE_PAYLOAD_FIELDS,
          when: Boolean(nurse?.isPrimaryRegionHhaManaged),
        },
      ],
    }),
  });

  return canEditNurseEmail({nurse})
    ? Object.assign({}, payload, {email: data.email})
    : payload;
};

/**
 * Generates form default values from a Nurse entity for edit mode.
 */
export const generateNurseFormDefaults = ({
  nurse,
}: {
  nurse: Nurse;
}): NurseFormPayload => ({
  firstName: nurse.firstName || '',
  lastName: nurse.lastName || '',
  email: nurse.email || '',
  phoneNo: nurse.phoneNo || '',
  address: nurse.address || '',
  city: nurse.city || '',
  state: nurse.state || '',
  zipCode: nurse.zipCode || '',
  role: SYSTEM_ROLES.nurse.value,
  professionalRole: nurse.professionalRole || '',
  licenseNumber: nurse.licenseNumber || '',
  licenseState: nurse.licenseState || DEFAULT_LICENSE_STATE,
  licenseExpirationDate: nurse.licenseExpirationDate || null,
  npi: nurse.npi || '',
  primaryRegionIds: nurse.primaryRegionIds || [],
  secondaryRegionIds: nurse.secondaryRegionIds || [],
  status: nurse.status?.toLowerCase() || ACTIVE_STATUS.active.value,
  onCallIndicator: nurse.onCallIndicator || false,
  preferredContactMethod: nurse.preferredContactMethod || '',
  joiningDate: nurse.joiningDate || null,
  notes: nurse.notes || '',
});
