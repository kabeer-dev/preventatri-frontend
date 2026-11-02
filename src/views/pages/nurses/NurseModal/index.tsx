'use client';

import {useEffect, useMemo} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {
  ACTIVE_STATUS,
  ACTIVE_STATUS_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
  SYSTEM_ROLES,
} from '@/shared/constants/common';
import {
  DEFAULT_LICENSE_STATE,
  PROFESSIONAL_ROLE_OPTIONS,
  LICENSE_STATE_OPTIONS,
} from '@/shared/constants/nurses';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useRegionSelectOptions} from '@/shared/hooks/useRegionSelectOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {NurseModalProps} from '@/shared/interfaces/nurse';
import {nurseFormSchema} from '@/shared/schemas/nurse';
import {NurseFormPayload, NurseFormValues} from '@/shared/types/nurse';
import {
  canEditNurseEmail,
  generateNurseFormDefaults,
  isHhaManagedNurse,
} from '@/shared/utils/nurseUtils';

import NurseModalUI from './NurseModalUI';

const defaultValues: NurseFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  role: SYSTEM_ROLES.nurse.value,
  professionalRole: '',
  licenseNumber: '',
  licenseState: DEFAULT_LICENSE_STATE,
  licenseExpirationDate: null,
  npi: '',
  primaryRegionIds: [],
  secondaryRegionIds: [],
  status: ACTIVE_STATUS.active.value,
  onCallIndicator: false,
  preferredContactMethod: '',
  joiningDate: null,
  notes: '',
};

const NurseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  nurse = null,
  embedded,
  formId,
  onDirtyChange,
}: NurseModalProps) => {
  const {t} = useTranslation();

  const savedRegionOptions = useMemo(
    () =>
      [
        ...(nurse?.primaryRegions ?? []),
        ...(nurse?.secondaryRegions ?? []),
      ].map((region) => ({value: region.id, label: region.name})),
    [nurse]
  );

  const primaryRegionSource = useRegionSelectOptions({
    enabled: isOpen,
    seedOptions: savedRegionOptions,
  });

  const secondaryRegionSource = useRegionSelectOptions({
    enabled: isOpen,
    seedOptions: savedRegionOptions,
  });

  const isEditMode = Boolean(nurse);

  // HHAeXchange owns this nurse's person, role, status and licence number, and
  // the nightly sync overwrites them, so those inputs are disabled. The backend
  // refuses the same fields -- this just makes it visible before the user
  // starts typing.
  const isHhaManaged = isHhaManagedNurse({nurse});
  const canEditEmail = canEditNurseEmail({nurse});

  const {
    control,
    handleSubmit,
    reset,
    formState: {isDirty},
  } = useForm<NurseFormPayload, unknown, NurseFormValues>({
    resolver: zodResolver(nurseFormSchema({t, isEditMode, isHhaManaged})),
    defaultValues,
  });

  const primaryRegionIds = useWatch({control, name: 'primaryRegionIds'}) || [];

  const secondaryRegionIds =
    useWatch({
      control,
      name: 'secondaryRegionIds',
    }) || [];

  // The hosting invite drawer needs this for its unsaved-changes prompt.
  useEffect(() => {
    onDirtyChange?.({isDirty});
  }, [isDirty, onDirtyChange]);

  // Reset form when modal opens - populate with nurse data if editing
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && nurse) reset(generateNurseFormDefaults({nurse}));
      else reset(defaultValues);
    }
  }, [isOpen, reset, isEditMode, nurse]);

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(defaultValues), POST_MODAL_CLEANUP_DELAY);
  };

  const handleFormSubmit = (data: NurseFormValues) => {
    onSubmit({...data, status: data.status.toUpperCase()});
  };

  return (
    <NurseModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit(handleFormSubmit)}
      control={control}
      isLoading={isLoading}
      embedded={embedded}
      formId={formId}
      primaryRegionSource={primaryRegionSource}
      secondaryRegionSource={secondaryRegionSource}
      primaryRegionIds={primaryRegionIds}
      secondaryRegionIds={secondaryRegionIds}
      isEditMode={isEditMode}
      isDirty={isDirty}
      isHhaManaged={isHhaManaged}
      isPrimaryRegionHhaManaged={Boolean(nurse?.isPrimaryRegionHhaManaged)}
      canEditEmail={canEditEmail}
      statusOptions={ACTIVE_STATUS_OPTIONS}
      roleOptions={PROFESSIONAL_ROLE_OPTIONS}
      licenseStateOptions={LICENSE_STATE_OPTIONS}
      contactMethodOptions={PREFERRED_CONTACT_OPTIONS}
    />
  );
};

export default NurseModal;
