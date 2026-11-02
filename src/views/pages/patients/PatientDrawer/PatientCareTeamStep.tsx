'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useWatch} from 'react-hook-form';

import Icon from '@/@core/components/icon';
import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import Loader from '@/shared/components/common/loaders/Loader';
import {PATIENT_DRAWER_FORM_IDS} from '@/shared/constants/patients';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientCareTeamStepProps} from '@/shared/interfaces/patient';
import {
  getSelectOptionLabel,
  resolveAssignmentCaregiverName,
  resolveAssignmentTemplateName,
} from '@/shared/utils/patientUtils';

import AssignmentRow from './AssignmentRow';
import NewAssignmentCard from './NewAssignmentCard';
import PatientCaseManagerField from './PatientCaseManagerField';
import PatientNurseFields from './PatientNurseFields';

const PatientCareTeamStep = ({
  onSubmit,
  patientControl,
  assignmentsControl,
  primaryNurseSource,
  secondaryNurseSource,
  caseManagerSource,
  isHhaManaged,
  patient,
  countyName,
  newAssignments,
  existingAssignments,
  removedAssignmentIds,
  collapsedAssignmentIds,
  isFetchingAssignments,
  isAssignable,
  isLoading,
  checklistTemplateOptions,
  onAddAssignment,
  onDiscardAssignment,
  onCollapseAssignment,
  onExpandAssignment,
  onRemoveExistingAssignment,
  onUndoRemoveAssignment,
}: PatientCareTeamStepProps) => {
  const {t} = useTranslation();

  const draftAssignments = useWatch({
    control: assignmentsControl,
    name: 'assignments',
  });

  const assessmentCount =
    existingAssignments.length -
    removedAssignmentIds.length +
    newAssignments.length;

  const isAssessmentsDisabled = !isAssignable || isLoading;

  const isEmpty =
    existingAssignments.length === 0 && newAssignments.length === 0;

  return (
    <form
      id={PATIENT_DRAWER_FORM_IDS.careTeam}
      onSubmit={onSubmit}
      className='flex flex-col gap-8'
    >
      <PatientNurseFields
        control={patientControl}
        primaryNurseSource={primaryNurseSource}
        secondaryNurseSource={secondaryNurseSource}
        isLoading={isLoading}
        isHhaManaged={isHhaManaged}
        patient={patient}
        countyName={countyName}
      />

      {isHhaManaged && (
        <PatientCaseManagerField
          control={patientControl}
          caseManagerSource={caseManagerSource}
          isLoading={isLoading}
          patient={patient}
        />
      )}

      <Box className='flex flex-col gap-3'>
        <SectionHeading
          title={t('patients.careTeam.assessments')}
          meta={`${assessmentCount}`}
          action={
            <Button
              variant='text'
              size='small'
              type='button'
              onClick={onAddAssignment}
              disabled={isAssessmentsDisabled}
              startIcon={<Icon icon='mdi:plus' fontSize={16} aria-hidden />}
            >
              {t('patients.careTeam.addAssessment')}
            </Button>
          }
        />

        {!isAssignable && (
          <Alert severity='warning' icon={<Icon icon='mdi:lock-outline' />}>
            {isHhaManaged
              ? t('patients.careTeam.inactiveNoticeHha')
              : t('patients.careTeam.inactiveNotice')}
          </Alert>
        )}

        {isFetchingAssignments && existingAssignments.length === 0 ? (
          <Box className='flex justify-center py-6'>
            <Loader size={32} />
          </Box>
        ) : (
          <Box className='flex flex-col gap-2'>
            {existingAssignments.map((assignment) => (
              <AssignmentRow
                key={assignment.id}
                title={resolveAssignmentTemplateName({
                  assignment,
                  checklistTemplateOptions,
                })}
                caregiverName={resolveAssignmentCaregiverName({assignment})}
                frequency={assignment.type}
                startDate={assignment.startDate}
                endDate={assignment.endDate}
                isRemoved={removedAssignmentIds.includes(assignment.id)}
                isDisabled={isAssessmentsDisabled}
                isSaving={isLoading}
                onRemove={() => onRemoveExistingAssignment({id: assignment.id})}
                onUndo={() => onUndoRemoveAssignment({id: assignment.id})}
              />
            ))}

            {newAssignments.map((field, index) =>
              collapsedAssignmentIds.includes(field.id) ? (
                <AssignmentRow
                  key={field.id}
                  title={getSelectOptionLabel({
                    options: checklistTemplateOptions,
                    value: draftAssignments?.[index]?.checklistTemplateId || '',
                  })}
                  caregiverName={draftAssignments?.[index]?.caregiverName || ''}
                  frequency={draftAssignments?.[index]?.frequency}
                  startDate={draftAssignments?.[index]?.startDate}
                  endDate={draftAssignments?.[index]?.endDate}
                  isNew
                  isDisabled={isAssessmentsDisabled}
                  onEdit={() => onExpandAssignment({index})}
                  onRemove={() => onDiscardAssignment({index})}
                />
              ) : (
                <NewAssignmentCard
                  key={field.id}
                  index={index}
                  control={assignmentsControl}
                  isDisabled={isAssessmentsDisabled}
                  onCollapse={onCollapseAssignment}
                  onDiscard={onDiscardAssignment}
                  checklistTemplateOptions={checklistTemplateOptions}
                />
              )
            )}

            {isEmpty && (
              <Box className='border-rule rounded-lg border border-dashed px-4 py-5 text-center'>
                <Typography variant='small' className='text-ink-soft'>
                  {t('patients.careTeam.empty')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </form>
  );
};

export default PatientCareTeamStep;
