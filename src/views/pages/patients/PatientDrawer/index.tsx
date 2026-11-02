'use client';

import {useState} from 'react';

import {FieldErrors} from 'react-hook-form';

import {
  PATIENT_CARE_TEAM_FORM_FIELDS,
  PATIENT_DRAWER_STEPS,
} from '@/shared/constants/patients';
import usePatientAssessmentOptions from '@/shared/hooks/patientDrawer/usePatientAssessmentOptions';
import usePatientAssignmentsDraft from '@/shared/hooks/patientDrawer/usePatientAssignmentsDraft';
import usePatientDetailsForm from '@/shared/hooks/patientDrawer/usePatientDetailsForm';
import usePatientDrawerSave from '@/shared/hooks/patientDrawer/usePatientDrawerSave';
import usePatientCountyOptions from '@/shared/hooks/usePatientCountyOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient, PatientDrawerProps} from '@/shared/interfaces/patient';
import {PatientDrawerStep, PatientFormPayload} from '@/shared/types/patient';
import {getFullName} from '@/shared/utils/general';
import {
  isHhaManagedPatient,
  isPatientAssignable,
  mergeSavedPatient,
} from '@/shared/utils/patientUtils';

import PatientDrawerUI from './PatientDrawerUI';

const PatientDrawer = ({
  isOpen,
  onClose,
  patient = null,
  initialStep = PATIENT_DRAWER_STEPS.details,
  onSaved,
}: PatientDrawerProps) => {
  const {t} = useTranslation();

  const [activeStep, setActiveStep] = useState<PatientDrawerStep>(initialStep);
  const [savedPatient, setSavedPatient] = useState<Patient | null>(patient);
  const [isSaving, setIsSaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      setActiveStep(initialStep);
      setSavedPatient(patient);
    }
  }

  const patientId = savedPatient?.id || '';

  // HHAeXchange-owned fields are disabled here; the backend enforces them too.
  const isHhaManaged = isHhaManagedPatient({patient: savedPatient});

  const countySource = usePatientCountyOptions({enabled: isOpen, patient});

  const {
    form: detailsForm,
    status,
    selectedCounty,
    primaryNurseSource,
    secondaryNurseSource,
    caseManagerSource,
  } = usePatientDetailsForm({isOpen, patient, countySource});

  const draft = usePatientAssignmentsDraft({
    isOpen,
    patientId,
    startWithNewAssignment: initialStep === PATIENT_DRAWER_STEPS.careTeam,
  });

  const assessmentOptions = usePatientAssessmentOptions({enabled: isOpen});

  const {savePatient, saveNewAssignments, deleteExistingAssignment} =
    usePatientDrawerSave();

  const isAssignable = isPatientAssignable({
    status,
    archived: savedPatient?.archived,
  });

  const isPatientDirty = detailsForm.formState.isDirty;

  const isDirty =
    isPatientDirty ||
    draft.form.formState.isDirty ||
    draft.removedIds.length > 0;

  const persistPatient = async ({data}: {data: PatientFormPayload}) => {
    const rawPatient = await savePatient({data, patient: savedPatient});

    if (rawPatient) {
      setSavedPatient(mergeSavedPatient({savedPatient, rawPatient}));
    }

    detailsForm.reset(data);
    onSaved?.();
  };

  const handleDetailsSubmit = detailsForm.handleSubmit(async (data) => {
    if (savedPatient && !isPatientDirty) {
      setActiveStep(PATIENT_DRAWER_STEPS.careTeam);

      return;
    }

    setIsSaving(true);

    try {
      await persistPatient({data});
      setActiveStep(PATIENT_DRAWER_STEPS.careTeam);
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
  });

  const handleCareTeamInvalid = (errors: FieldErrors<PatientFormPayload>) => {
    const hasDetailsError = Object.keys(errors).some(
      (field) => !PATIENT_CARE_TEAM_FORM_FIELDS.includes(field)
    );

    if (hasDetailsError) setActiveStep(PATIENT_DRAWER_STEPS.details);
  };

  const handleCareTeamSubmit = detailsForm.handleSubmit(async (data) => {
    const newAssignments = isAssignable
      ? await draft.validateNewAssignments()
      : [];

    if (!newAssignments) return;

    const removedIds = isAssignable ? draft.removedIds : [];

    setIsSaving(true);

    try {
      if (isPatientDirty) await persistPatient({data});

      if (newAssignments.length > 0) {
        await saveNewAssignments({assignments: newAssignments, patientId});
        draft.clearNewAssignments();
      }

      for (const id of removedIds) {
        await deleteExistingAssignment({id});
        draft.undoRemoveAssignment({id});
      }

      onSaved?.();
      onClose();
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
  }, handleCareTeamInvalid);

  const title = patient
    ? t('patients.editModalTitle')
    : t('patients.modalTitle');

  const subtitle = savedPatient
    ? [
        getFullName({
          firstName: savedPatient.firstName,
          lastName: savedPatient.lastName,
        }),
        selectedCounty?.label,
      ]
        .filter(Boolean)
        .join(' · ')
    : t('patients.drawerSubtitle');

  return (
    <PatientDrawerUI
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      activeStep={activeStep}
      canOpenCareTeam={Boolean(savedPatient)}
      onStepChange={({step}) => setActiveStep(step)}
      isLoading={isSaving}
      isDirty={isDirty}
      onBack={() => setActiveStep(PATIENT_DRAWER_STEPS.details)}
      detailsStep={{
        onSubmit: handleDetailsSubmit,
        control: detailsForm.control,
        countySource,
        isHhaManaged,
        isCountyHhaManaged: Boolean(savedPatient?.isCountyHhaManaged),
      }}
      careTeamStep={{
        onSubmit: handleCareTeamSubmit,
        patientControl: detailsForm.control,
        assignmentsControl: draft.form.control,
        primaryNurseSource,
        secondaryNurseSource,
        caseManagerSource,
        isHhaManaged,
        patient: savedPatient,
        countyName: selectedCounty?.label || '',
        newAssignments: draft.fields,
        existingAssignments: draft.existingAssignments,
        removedAssignmentIds: draft.removedIds,
        collapsedAssignmentIds: draft.collapsedIds,
        isFetchingAssignments: draft.isFetchingAssignments,
        isAssignable,
        isLoading: isSaving,
        ...assessmentOptions,
        onAddAssignment: draft.addAssignment,
        onDiscardAssignment: draft.discardAssignment,
        onCollapseAssignment: draft.collapseAssignment,
        onExpandAssignment: draft.expandAssignment,
        onRemoveExistingAssignment: draft.removeExistingAssignment,
        onUndoRemoveAssignment: draft.undoRemoveAssignment,
      }}
    />
  );
};

export default PatientDrawer;
