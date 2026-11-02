'use client';

import {useEffect, useRef} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {CHECKLIST_TEMPLATE_TYPES} from '@/shared/constants/assessmentChecklists';
import {
  FOLLOW_UP_DUE_TIME_DEFAULT,
  FOLLOW_UP_TASK_DEFAULT_PRIORITY,
} from '@/shared/constants/followUps';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {useFollowUpAssigneeOptions} from '@/shared/hooks/useFollowUpAssigneeOptions';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {usePatientPickerOptions} from '@/shared/hooks/usePatientPickerOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {useWorkItemChecklistOptions} from '@/shared/hooks/useWorkItemChecklistOptions';
import {FollowUpFormModalProps} from '@/shared/interfaces/followUp';
import {followUpFormSchema} from '@/shared/schemas/followUp';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {splitDueAt} from '@/shared/utils/followUpUtils';

import FollowUpFormModalUI from './FollowUpFormModalUI';

const defaultValues: FollowUpFormPayload = {
  patientId: '',
  title: '',
  description: '',
  visitNotes: '',
  assigneeUserOrganizationId: '',
  priority: FOLLOW_UP_TASK_DEFAULT_PRIORITY,
  dueDate: null,
  dueTime: FOLLOW_UP_DUE_TIME_DEFAULT,
  checklistTemplateId: '',
};

// Create and edit share one drawer: `task` switches it to edit mode and
// pre-fills the form from the record. `lockedPatient` opens it for a known
// patient (a task spawned from a supervisory visit).
const FollowUpFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  task,
  linkedAlert,
  lockedPatient,
  initialValues,
  submitLabel,
}: FollowUpFormModalProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {isAdmin} = useUserRole();
  const isEditMode = Boolean(task);
  const isPatientLocked = isEditMode || Boolean(lockedPatient);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: {isDirty},
  } = useForm<FollowUpFormPayload>({
    resolver: zodResolver(followUpFormSchema({t, zone})),
    defaultValues,
  });

  const patientId = useWatch({control, name: 'patientId'});

  const patientPicker = usePatientPickerOptions({
    enabled: isOpen && !isPatientLocked,
    lockedPatient: task
      ? Object.assign({id: task.patientId}, task.patient)
      : lockedPatient,
  });

  const {
    options: assigneeOptions,
    selfUserOrgId,
    isLoading: isAssigneesLoading,
  } = useFollowUpAssigneeOptions({patientId, enabled: isOpen});

  const checklistSource = useWorkItemChecklistOptions({
    type: CHECKLIST_TEMPLATE_TYPES.FOLLOW_UP.value,
    enabled: isOpen,
    seedTemplate: task?.checklistTemplate,
  });

  // Callers often build `lockedPatient` / `initialValues` inline, so the reset
  // keys on the patient id and reads the rest through a ref; otherwise every
  // parent render would wipe what the user typed.
  const lockedPatientId = lockedPatient?.id ?? null;
  const initialValuesRef = useRef(initialValues);

  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  useEffect(() => {
    if (!isOpen) return;

    if (!task) {
      reset(
        Object.assign(
          {},
          defaultValues,
          lockedPatientId ? {patientId: lockedPatientId} : {},
          initialValuesRef.current || {}
        )
      );

      return;
    }

    const {dueDate, dueTime} = splitDueAt({dueAt: task.dueAt, zone});

    reset({
      patientId: task.patientId,
      title: task.title,
      description: task.description ?? '',
      visitNotes: task.visitInstructions ?? '',
      assigneeUserOrganizationId: task.assigneeUserOrganizationId,
      priority: task.priority,
      dueDate,
      dueTime,
      checklistTemplateId: task.checklistTemplateId ?? '',
    });
  }, [isOpen, task, lockedPatientId, zone, reset]);

  // The care team depends on the patient, so a new patient clears the assignee.
  // Skipped on the open/reset that set the patient in the first place.
  const previousPatientRef = useRef(patientId);
  useEffect(() => {
    if (previousPatientRef.current !== patientId) {
      previousPatientRef.current = patientId;
      if (!isPatientLocked) setValue('assigneeUserOrganizationId', '');
    }
  }, [patientId, isPatientLocked, setValue]);

  // Nurses and case managers own what they create unless they pick someone
  // else; admins must choose.
  useEffect(() => {
    if (isEditMode || isAdmin || !selfUserOrgId) return;
    if (!getValues('assigneeUserOrganizationId'))
      setValue('assigneeUserOrganizationId', selfUserOrgId);
  }, [patientId, isEditMode, isAdmin, selfUserOrgId, getValues, setValue]);

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(defaultValues), POST_MODAL_CLEANUP_DELAY);
  };

  return (
    <FollowUpFormModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit((data) => onSubmit(data))}
      control={control}
      isDirty={isDirty}
      isLoading={isLoading}
      isEditMode={isEditMode}
      patientPicker={patientPicker}
      assigneeOptions={assigneeOptions}
      checklistSource={checklistSource}
      isPatientFieldDisabled={isPatientLocked}
      isAssigneeFieldDisabled={!patientId}
      isAssigneesLoading={isAssigneesLoading}
      linkedAlert={linkedAlert ?? task?.source?.alert ?? null}
      submitLabel={submitLabel}
    />
  );
};

export default FollowUpFormModal;
