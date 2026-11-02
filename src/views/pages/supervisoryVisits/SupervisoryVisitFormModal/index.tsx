'use client';

import {useEffect, useRef} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import {
  SUPERVISORY_VISIT_DEFAULT_END_TIME,
  SUPERVISORY_VISIT_DEFAULT_START_TIME,
  SUPERVISORY_VISIT_DEFAULT_TYPE,
  SUPERVISORY_VISIT_TYPE,
} from '@/shared/constants/supervisoryVisits';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {usePatientPickerOptions} from '@/shared/hooks/usePatientPickerOptions';
import {useSupervisoryVisitCareTeamOptions} from '@/shared/hooks/useSupervisoryVisitCareTeamOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {SupervisoryVisitFormModalProps} from '@/shared/interfaces/supervisoryVisit';
import {supervisoryVisitFormSchema} from '@/shared/schemas/supervisoryVisit';
import {SupervisoryVisitFormPayload} from '@/shared/types/supervisoryVisit';
import {splitSchedule} from '@/shared/utils/supervisoryVisitUtils';

import SupervisoryVisitFormModalUI from './SupervisoryVisitFormModalUI';

const defaultValues: SupervisoryVisitFormPayload = {
  patientId: '',
  visitType: SUPERVISORY_VISIT_DEFAULT_TYPE,
  visitTypeOther: '',
  description: '',
  assigneeUserOrganizationId: '',
  checklistTemplateId: '',
  scheduledDate: null,
  startTime: SUPERVISORY_VISIT_DEFAULT_START_TIME,
  endTime: SUPERVISORY_VISIT_DEFAULT_END_TIME,
  caregiverUserOrganizationIds: [],
};

// Schedule and edit share one drawer: `visit` switches it to edit mode and
// pre-fills the form from the record.
const SupervisoryVisitFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  visit,
}: SupervisoryVisitFormModalProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const {isAdmin} = useUserRole();
  const isEditMode = Boolean(visit);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: {isDirty},
  } = useForm<SupervisoryVisitFormPayload>({
    resolver: zodResolver(supervisoryVisitFormSchema({t, zone})),
    defaultValues,
  });

  const patientId = useWatch({control, name: 'patientId'});
  const visitType = useWatch({control, name: 'visitType'});

  const patientPicker = usePatientPickerOptions({
    enabled: isOpen && !isEditMode,
    lockedPatient: visit
      ? Object.assign({id: visit.patientId}, visit.patient)
      : null,
  });

  const {
    assigneeOptions,
    caregiverOptions,
    selfUserOrgId,
    isLoading: isCareTeamLoading,
  } = useSupervisoryVisitCareTeamOptions({patientId, enabled: isOpen});

  useEffect(() => {
    if (!isOpen) return;

    if (!visit) {
      reset(defaultValues);

      return;
    }

    reset(
      Object.assign(
        {
          patientId: visit.patientId,
          visitType: visit.visitType,
          visitTypeOther: visit.visitTypeOther ?? '',
          description: visit.description ?? '',
          assigneeUserOrganizationId: visit.assigneeUserOrganizationId,
          checklistTemplateId: visit.checklistTemplateId,
          caregiverUserOrganizationIds: (visit.caregivers || []).map(
            (entry) => entry.userOrgId
          ),
        },
        splitSchedule({visit, zone})
      )
    );
  }, [isOpen, visit, zone, reset]);

  // The care team depends on the patient, so a new patient clears both
  // pickers. Skipped on the open/reset that set the patient in the first place.
  const previousPatientRef = useRef(patientId);
  useEffect(() => {
    if (previousPatientRef.current !== patientId) {
      previousPatientRef.current = patientId;
      if (!isEditMode) {
        setValue('assigneeUserOrganizationId', '');
        setValue('caregiverUserOrganizationIds', []);
      }
    }
  }, [patientId, isEditMode, setValue]);

  // Nurses and case managers perform what they schedule unless they pick
  // someone else; admins must choose.
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
    <SupervisoryVisitFormModalUI
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit((data) => onSubmit(data))}
      control={control}
      isDirty={isDirty}
      isLoading={isLoading}
      isEditMode={isEditMode}
      patientPicker={patientPicker}
      assigneeOptions={assigneeOptions}
      caregiverOptions={caregiverOptions}
      checklistSeedTemplate={visit?.checklistTemplate}
      isPatientFieldDisabled={isEditMode}
      isCareTeamDisabled={!patientId}
      isCareTeamLoading={isCareTeamLoading}
      showVisitTypeOther={visitType === SUPERVISORY_VISIT_TYPE.OTHER.value}
    />
  );
};

export default SupervisoryVisitFormModal;
