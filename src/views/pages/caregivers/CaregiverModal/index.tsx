'use client';

import {useEffect} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {
  CAREGIVER_ROLE_OPTIONS,
  CAREGIVER_SOURCE,
  CAREGIVER_STATUS,
  CAREGIVER_STATUS_OPTIONS,
  RELATIONSHIP_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/shared/constants/caregivers';
import {PREFERRED_CONTACT_OPTIONS} from '@/shared/constants/common';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useTranslation from '@/shared/hooks/useTranslation';
import {Caregiver, CaregiverModalProps} from '@/shared/interfaces/caregiver';
import {caregiverFormSchema} from '@/shared/schemas/caregiver';
import {
  CaregiverFormPayload,
  CaregiverFormValues,
} from '@/shared/types/caregiver';

import CaregiverModalUI from './CaregiverModalUI';

const defaultValues: CaregiverFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  caregiverRole: '',
  status: CAREGIVER_STATUS.active.value,
  preferredContactMethod: '',
  relationshipToPatient: '',
  language: '',
  notes: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  startDate: null,
  terminationDate: null,
  onCallIndicator: false,
};

const generateDefaultValue = ({
  caregiver,
}: {
  caregiver: Caregiver;
}): CaregiverFormPayload => {
  return {
    firstName: caregiver.firstName || '',
    lastName: caregiver.lastName || '',
    email: caregiver.email || '',
    phoneNo: caregiver.phoneNo || '',
    caregiverRole: caregiver.caregiverRole || '',

    // The API sends the enum uppercase ('ON_LEAVE'); the form and every status
    // map on this page are keyed lowercase, and caregiverUtils uppercases it
    // again on the way back out.
    status: caregiver.status?.toLowerCase() || CAREGIVER_STATUS.active.value,
    preferredContactMethod: caregiver.preferredContactMethod || '',
    relationshipToPatient: caregiver.relationshipToPatient || '',
    language: caregiver.language || '',
    notes: caregiver.notes || '',
    address: caregiver.address || '',
    city: caregiver.city || '',
    state: caregiver.state || '',
    zipCode: caregiver.zipCode || '',
    startDate: caregiver.startDate || null,
    terminationDate: caregiver.terminationDate || null,
    onCallIndicator: caregiver.onCallIndicator || false,
  };
};

const CaregiverModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  caregiver = null,
  embedded,
  formId,
  onDirtyChange,
}: CaregiverModalProps) => {
  const {t} = useTranslation();

  const isEditMode = Boolean(caregiver);

  // HHAeXchange owns this caregiver's demographics and the nightly sync
  // overwrites them, so those inputs are disabled. The backend refuses the same
  // fields — this just makes it visible before the user starts typing.
  const isHhaManaged = caregiver?.source === CAREGIVER_SOURCE.hhaExchange.value;

  // The sole exception: an imported caregiver HHAeXchange had no email for
  // carries a generated placeholder, and replacing it is the only way they can
  // ever be invited.
  const canEditEmail = Boolean(isHhaManaged && caregiver?.isPlaceholderEmail);

  const {
    control,
    handleSubmit,
    reset,
    formState: {isDirty},
  } = useForm<CaregiverFormPayload, unknown, CaregiverFormValues>({
    resolver: zodResolver(caregiverFormSchema({t})),
    defaultValues,
  });

  // The hosting invite drawer needs this for its unsaved-changes prompt.
  useEffect(() => {
    onDirtyChange?.({isDirty});
  }, [isDirty, onDirtyChange]);

  // Reset form when modal opens - populate with caregiver data if editing
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && caregiver) reset(generateDefaultValue({caregiver}));
      else reset(defaultValues);
    }
  }, [isOpen, reset, isEditMode, caregiver]);

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(defaultValues), POST_MODAL_CLEANUP_DELAY);
  };

  const handleFormSubmit = (data: CaregiverFormValues) => {
    onSubmit(data);
  };

  return (
    <CaregiverModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit(handleFormSubmit)}
      control={control}
      isLoading={isLoading}
      isEditMode={isEditMode}
      isDirty={isDirty}
      roleOptions={CAREGIVER_ROLE_OPTIONS}
      statusOptions={CAREGIVER_STATUS_OPTIONS}
      contactMethodOptions={PREFERRED_CONTACT_OPTIONS}
      relationshipOptions={RELATIONSHIP_OPTIONS}
      languageOptions={LANGUAGE_OPTIONS}
      embedded={embedded}
      formId={formId}
      isHhaManaged={isHhaManaged}
      canEditEmail={canEditEmail}
    />
  );
};

export default CaregiverModal;
