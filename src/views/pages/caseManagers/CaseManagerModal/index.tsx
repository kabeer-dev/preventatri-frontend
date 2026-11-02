'use client';

import {useEffect, useMemo, useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {LANGUAGE_OPTIONS} from '@/shared/constants/caregivers';
import {
  CASE_MANAGER_FORM_DEFAULTS,
  CASE_MANAGER_SOURCE,
} from '@/shared/constants/caseManagers';
import {
  ACTIVE_STATUS_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
} from '@/shared/constants/common';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useCaseManagerPatientOptions} from '@/shared/hooks/useCaseManagerPatientOptions';
import {useRegionSelectOptions} from '@/shared/hooks/useRegionSelectOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseManagerModalProps} from '@/shared/interfaces/caseManager';
import {caseManagerFormSchema} from '@/shared/schemas/caseManager';
import {
  CaseManagerFormPayload,
  CaseManagerFormValues,
} from '@/shared/types/caseManager';
import {
  generateCaseManagerFormDefaults,
  getUnassignedPatients,
} from '@/shared/utils/caseManagerUtils';

import CaseManagerModalUI from './CaseManagerModalUI';
import UnassignPatientsDialog from './UnassignPatientsDialog';

const CaseManagerModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  caseManager = null,
  embedded,
  formId,
  onDirtyChange,
}: CaseManagerModalProps) => {
  const {t} = useTranslation();

  const savedRegionOptions = useMemo(
    () =>
      (caseManager?.regions ?? []).map((region) => ({
        value: region.id,
        label: region.name,
      })),
    [caseManager]
  );

  const regionSource = useRegionSelectOptions({
    enabled: isOpen,
    seedOptions: savedRegionOptions,
  });

  const isEditMode = Boolean(caseManager);

  // HHAeXchange owns this case manager's first name, last name and status,
  // and the nightly sync overwrites them, so those inputs are disabled. The
  // backend refuses the same fields — this just makes it visible before the
  // user starts typing.
  const isHhaManaged =
    caseManager?.source === CASE_MANAGER_SOURCE.hhaExchange.value;

  // The sole exception: an imported case manager for whom HHAeXchange had no
  // email carries a generated placeholder, and replacing it is the only way
  // they can ever be invited.
  const canEditEmail = Boolean(isHhaManaged && caseManager?.isPlaceholderEmail);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {isDirty},
  } = useForm<CaseManagerFormPayload, unknown, CaseManagerFormValues>({
    resolver: zodResolver(caseManagerFormSchema({t, isEdit: isEditMode})),
    defaultValues: CASE_MANAGER_FORM_DEFAULTS,
  });

  const assignedRegions = useWatch({control, name: 'regionIds'});
  const currentPatientIds = useWatch({control, name: 'patientIds'});

  // Holds a validated submission while the unassign confirmation is open.
  const [pendingPayload, setPendingPayload] =
    useState<CaseManagerFormValues | null>(null);

  // Region-scoped available patients, pruned as regions change. Lives in a
  // hook so this container stays under the 200-line cap.
  const patientOptions = useCaseManagerPatientOptions({
    isOpen,
    isEditMode,
    caseManager,
    assignedRegions,
    currentPatientIds,
    setValue,
  });

  const [wasOpen, setWasOpen] = useState(isOpen);

  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    setPendingPayload(null);
  }

  // The hosting invite drawer needs this for its unsaved-changes prompt.
  useEffect(() => {
    onDirtyChange?.({isDirty});
  }, [isDirty, onDirtyChange]);

  // Reset form when modal opens - populate with case manager data if editing.
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && caseManager)
        reset(generateCaseManagerFormDefaults({caseManager}));
      else reset(CASE_MANAGER_FORM_DEFAULTS);
    }
  }, [isOpen, reset, isEditMode, caseManager]);

  const handleClose = () => {
    onClose();
    setTimeout(
      () => reset(CASE_MANAGER_FORM_DEFAULTS),
      POST_MODAL_CLEANUP_DELAY
    );
  };

  const submitCaseManager = (data: CaseManagerFormValues) => {
    onSubmit(Object.assign({}, data, {status: data.status.toUpperCase()}));
  };

  // Dropping a patient also removes this case manager's pending follow-up tasks
  // and supervisory visits for them, so the save is held until the admin
  // acknowledges it. Additions and unchanged rosters delete nothing.
  const handleFormSubmit = (data: CaseManagerFormValues) => {
    const dropped = getUnassignedPatients({
      caseManager,
      patientIds: data.patientIds,
    });

    if (dropped.length) setPendingPayload(data);
    else submitCaseManager(data);
  };

  const handleConfirmUnassign = () => {
    if (pendingPayload) submitCaseManager(pendingPayload);
  };

  return (
    <>
      <CaseManagerModalUI
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit(handleFormSubmit)}
        control={control}
        isLoading={isLoading}
        regionSource={regionSource}
        patientOptions={patientOptions}
        hasRegionsSelected={Boolean(assignedRegions?.length)}
        hhaPatients={caseManager?.hhaPatients || []}
        isEditMode={isEditMode}
        isDirty={isDirty}
        statusOptions={ACTIVE_STATUS_OPTIONS}
        contactMethodOptions={PREFERRED_CONTACT_OPTIONS}
        languageOptions={LANGUAGE_OPTIONS}
        embedded={embedded}
        formId={formId}
        isHhaManaged={isHhaManaged}
        canEditEmail={canEditEmail}
      />

      <UnassignPatientsDialog
        isOpen={Boolean(pendingPayload)}
        isLoading={isLoading}
        onCancel={() => setPendingPayload(null)}
        onConfirm={handleConfirmUnassign}
      />
    </>
  );
};

export default CaseManagerModal;
