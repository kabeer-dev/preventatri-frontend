'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFAutocompleteField from '@/shared/components/common/inputs/RHFAutocompleteField';
import RHFSegmentedField from '@/shared/components/common/inputs/RHFSegmentedField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {FormDrawer} from '@/shared/components/common/modals';
import {
  FOLLOW_UP_FORM_ID,
  FOLLOW_UP_TASK_PRIORITY,
} from '@/shared/constants/followUps';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpFormModalUIProps} from '@/shared/interfaces/followUp';
import {getAlertTypeLabelKey} from '@/shared/utils/followUpUtils';

import FollowUpDueFields from './FollowUpDueFields';

const FollowUpFormModalUI = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  isDirty,
  isLoading = false,
  isEditMode = false,
  patientPicker,
  assigneeOptions,
  checklistSource,
  isPatientFieldDisabled = false,
  isAssigneeFieldDisabled = false,
  isAssigneesLoading = false,
  linkedAlert,
  submitLabel,
}: FollowUpFormModalUIProps) => {
  const {t} = useTranslation();

  const priorityOptions = Object.values(FOLLOW_UP_TASK_PRIORITY).map(
    ({value, labelKey}) => ({value, label: t(labelKey)})
  );

  return (
    <FormDrawer
      title={t(
        isEditMode ? 'followUps.create.editTitle' : 'followUps.create.title'
      )}
      subtitle={t('followUps.create.drawerSubtitle')}
      isOpen={isOpen}
      onClose={onClose}
      formId={FOLLOW_UP_FORM_ID}
      isDirty={isDirty}
      isLoading={isLoading}
      isEditMode={isEditMode}
      submitLabel={
        submitLabel ??
        t(isEditMode ? 'followUps.create.save' : 'followUps.create.submit')
      }
    >
      <form id={FOLLOW_UP_FORM_ID} onSubmit={onSubmit} className='pt-2'>
        <Box className='grid grid-cols-1 gap-4'>
          <RHFAsyncAutocompleteField
            name='patientId'
            control={control}
            label={t('followUps.create.patient')}
            placeholder={t('followUps.create.patientPlaceholder')}
            source={patientPicker}
            loadingText={t('common.loading')}
            noOptionsText={t('followUps.create.noMatchingPatients')}
            disabled={isPatientFieldDisabled || isLoading}
          />

          <RHFTextField
            name='title'
            control={control}
            label={t('followUps.create.task')}
            placeholder={t('followUps.create.taskPlaceholder')}
            disabled={isLoading}
          />

          <RHFTextField
            name='description'
            control={control}
            label={`${t('followUps.create.description')} · ${t('followUps.create.descriptionHint')}`}
            placeholder={t('followUps.create.descriptionPlaceholder')}
            multiline
            rows={3}
            disabled={isLoading}
          />

          <RHFTextField
            name='visitNotes'
            control={control}
            label={t('followUps.create.visitNotes')}
            placeholder={t('followUps.create.visitNotesPlaceholder')}
            multiline
            rows={2}
            disabled={isLoading}
          />

          <RHFAutocompleteField
            name='assigneeUserOrganizationId'
            control={control}
            label={t('followUps.create.assignTo')}
            options={assigneeOptions}
            loading={isAssigneesLoading}
            loadingText={t('common.loading')}
            noOptionsText={t(
              isAssigneeFieldDisabled
                ? 'followUps.create.selectPatientFirst'
                : 'followUps.create.noAssignees'
            )}
            disabled={isAssigneeFieldDisabled || isLoading}
          />

          <RHFSegmentedField
            name='priority'
            control={control}
            label={t('followUps.create.priority')}
            options={priorityOptions}
            disabled={isLoading}
          />

          <FollowUpDueFields control={control} disabled={isLoading} />

          <Box>
            <Typography variant='small' sx={{color: 'text.secondary'}}>
              {t('followUps.create.reminders')}:{' '}
              {t('followUps.create.remindersValue')}
            </Typography>
          </Box>

          <RHFAsyncAutocompleteField
            name='checklistTemplateId'
            control={control}
            label={`${t('followUps.create.checklist')} · ${t('followUps.create.checklistOptional')}`}
            source={checklistSource}
            noOptionsText={t('followUps.create.noChecklists')}
            disabled={isLoading}
          />

          {linkedAlert && (
            <Box>
              <Typography
                variant='small'
                sx={{display: 'block', mb: 1, color: 'text.secondary'}}
              >
                {t('followUps.create.linkedTo')}
              </Typography>
              <Box
                className='flex items-center gap-2 rounded px-3 py-2'
                sx={{bgcolor: 'action.hover', color: 'error.main'}}
              >
                <Icon icon='mdi:alert' fontSize={16} />
                <Typography variant='bodyStrong' sx={{color: 'text.primary'}}>
                  {t(getAlertTypeLabelKey({alert: linkedAlert}))} ·{' '}
                  {linkedAlert.description}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </form>
    </FormDrawer>
  );
};

export default FollowUpFormModalUI;
