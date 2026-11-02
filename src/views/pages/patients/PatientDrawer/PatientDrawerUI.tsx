'use client';

import Typography from '@mui/material/Typography';

import {FormDrawer} from '@/shared/components/common/modals';
import {
  PATIENT_DRAWER_FORM_IDS,
  PATIENT_DRAWER_STEP_ORDER,
  PATIENT_DRAWER_STEPS,
} from '@/shared/constants/patients';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientDrawerUIProps} from '@/shared/interfaces/patient';

import PatientCareTeamStep from './PatientCareTeamStep';
import PatientDetailsStep from './PatientDetailsStep';
import PatientDrawerStepper from './PatientDrawerStepper';

const PatientDrawerUI = ({
  isOpen,
  onClose,
  title,
  subtitle,
  activeStep,
  canOpenCareTeam,
  onStepChange,
  isLoading,
  isDirty,
  onBack,
  detailsStep,
  careTeamStep,
}: PatientDrawerUIProps) => {
  const {t} = useTranslation();

  const isCareTeamStep = activeStep === PATIENT_DRAWER_STEPS.careTeam;

  return (
    <FormDrawer
      title={title}
      subtitle={subtitle}
      isOpen={isOpen}
      onClose={onClose}
      formId={PATIENT_DRAWER_FORM_IDS[activeStep]}
      isLoading={isLoading}
      isDirty={isDirty}
      subheader={
        <PatientDrawerStepper
          activeStep={activeStep}
          canOpenCareTeam={canOpenCareTeam}
          onStepChange={onStepChange}
        />
      }
      footerStartContent={
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {t('patients.drawerSteps.counter', {
            current: PATIENT_DRAWER_STEP_ORDER.indexOf(activeStep) + 1,
            total: PATIENT_DRAWER_STEP_ORDER.length,
          })}
        </Typography>
      }
      submitLabel={
        isCareTeamStep
          ? t('patients.careTeam.saveButton')
          : t('patients.saveAndContinue')
      }
      {...(isCareTeamStep
        ? {cancelLabel: t('patients.backButton'), onCancel: onBack}
        : {allowPristineSubmit: canOpenCareTeam})}
    >
      {isCareTeamStep ? (
        <PatientCareTeamStep {...careTeamStep} />
      ) : (
        <PatientDetailsStep {...detailsStep} />
      )}
    </FormDrawer>
  );
};

export default PatientDrawerUI;
