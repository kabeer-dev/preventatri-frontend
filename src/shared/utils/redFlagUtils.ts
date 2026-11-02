import {
  FLAGGED_ASSESSMENT_REASON,
  RED_FLAG_OPEN_STATUSES,
  RED_FLAG_OTHER_REASON,
  RED_FLAG_REASONS,
  RED_FLAG_STATUS,
  RED_FLAG_VOIDABLE_STATUSES,
} from '@/shared/constants/redFlag';
import {
  EmergencyFlagListItem,
  RawEmergencyFlagResponse,
} from '@/shared/interfaces/emergencyFlag';

export const isUnresolvedFlagStatus = ({status}: {status?: string | null}) =>
  Boolean(status && RED_FLAG_OPEN_STATUSES.includes(status));

export const isResolvedFlagStatus = ({status}: {status?: string | null}) =>
  status === RED_FLAG_STATUS.RESOLVED.value;

export const isAcceptedFlagStatus = ({status}: {status?: string | null}) =>
  status === RED_FLAG_STATUS.ACCEPTED.value;

// Only a flag still open (pending or accepted) and not yet voided can be voided.
export const isFlagVoidable = ({
  status,
  voidedAt,
}: {
  status?: string | null;
  voidedAt?: string | null;
}) =>
  !voidedAt &&
  (RED_FLAG_VOIDABLE_STATUSES as readonly string[]).includes(
    status?.toUpperCase() ?? ''
  );

export const getReasonLabel = ({reason}: {reason: number | string}) => {
  if (typeof reason === 'string') return reason;

  return RED_FLAG_REASONS[reason]?.label || FLAGGED_ASSESSMENT_REASON;
};

export const transformRedFlagResponse = ({
  redFlag,
}: {
  redFlag: RawEmergencyFlagResponse;
}): EmergencyFlagListItem => {
  const patient = redFlag.patient || {};
  const user = redFlag.submitter || {};

  return {
    id: redFlag.id,
    patientId: redFlag.patientId || '',
    patientName: [patient.firstName, patient.lastName]
      .filter(Boolean)
      .join(' '),
    caregiverName: [user.firstName, user.lastName].filter(Boolean).join(' '),
    reason: redFlag.reason,
    flag: redFlag.flag,
    status: redFlag.status,
    description: redFlag.description || '',
    createdAt: redFlag.createdAt || '',
    voidedAt: redFlag.voidedAt || null,
    resolvedAt: redFlag.resolvedAt || null,
    acceptedAt: redFlag.acceptedAt || null,
  };
};

/**
 * The description the API receives.
 *
 * "Other" has no free-text field on the API, so what the caregiver typed is
 * carried at the front of the description. Built here and only here, so the
 * form that sends it and the rule that measures it cannot disagree on length.
 */
export const buildRedFlagDescription = ({
  reason,
  otherReason,
  description,
}: {
  reason: number;
  otherReason?: string;
  description: string;
}): string => {
  if (reason !== RED_FLAG_OTHER_REASON || !otherReason) return description;

  return `Reason: ${otherReason}. ${description}`;
};

/**
 * The multipart body of POST /assessments/emergency-flags. Both red flag
 * forms send it, so the keys and their order are decided here once: reason,
 * description, patientId, every image under `images`, then the voice note.
 */
export const buildRedFlagFormData = ({
  reason,
  description,
  patientId,
  images,
  audioBlob,
}: {
  reason: number;
  description: string;
  patientId: string;
  images: File[];
  audioBlob: Blob | null;
}): FormData => {
  const formData = new FormData();

  formData.append('reason', String(reason));
  formData.append('description', description);
  formData.append('patientId', patientId);

  images.forEach((file) => formData.append('images', file));

  if (audioBlob) {
    // Safari records mp4, every other browser webm.
    const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';

    formData.append('audioNote', audioBlob, `audio-note.${extension}`);
  }

  return formData;
};
