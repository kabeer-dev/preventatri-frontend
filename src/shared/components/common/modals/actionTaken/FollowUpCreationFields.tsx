'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFAutocompleteField from '@/shared/components/common/inputs/RHFAutocompleteField';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFSegmentedField from '@/shared/components/common/inputs/RHFSegmentedField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import RHFTimeField from '@/shared/components/common/inputs/RHFTimeField';
import {CHECKLIST_TEMPLATE_TYPES} from '@/shared/constants/assessmentChecklists';
import {FOLLOW_UP_TASK_PRIORITY} from '@/shared/constants/followUps';
import {useFollowUpAssigneeOptions} from '@/shared/hooks/useFollowUpAssigneeOptions';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {useWorkItemChecklistOptions} from '@/shared/hooks/useWorkItemChecklistOptions';
import {FollowUpCreationFieldsProps} from '@/shared/interfaces/flag';
import {getToday} from '@/shared/utils/dateUtils';

// The follow-up task a resolver can spawn from a flag: title, when, what,
// who (care team, defaults to the case manager), priority and an optional
// checklist. No checklist is attached unless one is picked here.
const FollowUpCreationFields = ({
  control,
  patientId,
  disabled = false,
}: FollowUpCreationFieldsProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const today = getToday({zone});

  const {options: assigneeOptions, isLoading: isAssigneesLoading} =
    useFollowUpAssigneeOptions({patientId});

  const checklistSource = useWorkItemChecklistOptions({
    type: CHECKLIST_TEMPLATE_TYPES.FOLLOW_UP.value,
  });

  const priorityOptions = Object.values(FOLLOW_UP_TASK_PRIORITY).map(
    ({value, labelKey}) => ({value, label: t(labelKey)})
  );

  return (
    <Box sx={{display: 'grid', gap: 2.5, pl: 7.5, pt: 1, pb: 2}}>
      <RHFTextField
        name='followUpTitle'
        control={control}
        label={t('flag.actionTaken.followUpTitleLabel')}
        placeholder={t('flag.actionTaken.followUpTitlePlaceholder')}
        disabled={disabled}
        size='small'
      />
      <Box className='grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2.5'>
        <RHFDateField
          name='followUpDate'
          control={control}
          label={t('flag.actionTaken.followUpDateLabel')}
          minDate={today}
          disabled={disabled}
          size='small'
          clearable
        />
        <RHFTimeField
          name='followUpTime'
          control={control}
          label={t('flag.actionTaken.followUpTimeLabel')}
          disabled={disabled}
          size='small'
        />
      </Box>
      <RHFTextField
        name='followUpDescription'
        control={control}
        label={t('flag.actionTaken.followUpDescriptionLabel')}
        placeholder={t('flag.actionTaken.followUpDescriptionPlaceholder')}
        multiline
        rows={2}
        disabled={disabled}
      />
      <Box>
        <RHFAutocompleteField
          name='followUpAssigneeUserOrganizationId'
          control={control}
          label={t('flag.actionTaken.followUpAssigneeLabel')}
          options={assigneeOptions}
          loading={isAssigneesLoading}
          loadingText={t('common.loading')}
          disabled={disabled}
        />
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {t('flag.actionTaken.followUpAssigneeHelper')}
        </Typography>
      </Box>
      <RHFSegmentedField
        name='followUpPriority'
        control={control}
        label={t('flag.actionTaken.followUpPriorityLabel')}
        options={priorityOptions}
        disabled={disabled}
      />
      <RHFAsyncAutocompleteField
        name='followUpChecklistTemplateId'
        control={control}
        label={t('flag.actionTaken.followUpChecklistLabel')}
        source={checklistSource}
        noOptionsText={t('flag.actionTaken.followUpChecklistNone')}
        disabled={disabled}
      />
    </Box>
  );
};

export default FollowUpCreationFields;
