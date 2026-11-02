'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {inputBaseClasses} from '@mui/material/InputBase';
import {outlinedInputClasses} from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import {pickersOutlinedInputClasses} from '@mui/x-date-pickers/PickersTextField';
import {useController, useWatch} from 'react-hook-form';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {ASSIGNMENT_FREQUENCY_OPTIONS} from '@/shared/constants/patients';
import useCaregiverSearchOptions from '@/shared/hooks/useCaregiverSearchOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {NewAssignmentCardProps} from '@/shared/interfaces/patient';
import {getToday, toDateTime} from '@/shared/utils/dateUtils';

const NewAssignmentCard = ({
  index,
  control,
  isDisabled,
  onCollapse,
  onDiscard,
  checklistTemplateOptions,
}: NewAssignmentCardProps) => {
  const {t} = useTranslation();

  const today = getToday();

  const selectedCaregiverId = useWatch({
    control,
    name: `assignments.${index}.caregiverId` as const,
  });

  const {field: caregiverNameField} = useController({
    control,
    name: `assignments.${index}.caregiverName` as const,
  });

  const selectedCaregiver = selectedCaregiverId
    ? {value: selectedCaregiverId, label: caregiverNameField.value || ''}
    : null;

  const caregiverSource = useCaregiverSearchOptions({
    enabled: !isDisabled,
    selectedOption: selectedCaregiver,
  });

  const startDateValue = useWatch({
    control,
    name: `assignments.${index}.startDate` as const,
  });

  const endDateValue = useWatch({
    control,
    name: `assignments.${index}.endDate` as const,
  });

  const endDateMin = toDateTime({value: startDateValue}) ?? today;
  const startDateMax = toDateTime({value: endDateValue}) ?? undefined;

  return (
    <Box
      className='border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4'
      sx={{
        [`& .${outlinedInputClasses.root}:not(.${inputBaseClasses.disabled}), & .${pickersOutlinedInputClasses.root}:not(.${inputBaseClasses.disabled})`]:
          {backgroundColor: 'transparent'},
      }}
    >
      <Box className='flex items-center gap-2'>
        <CustomChip label={t('patients.careTeam.newTag')} />
        <Typography variant='bodyStrong'>
          {t('patients.careTeam.assessment')}
        </Typography>
        <IconButton
          size='small'
          type='button'
          disabled={isDisabled}
          onClick={() => onDiscard({index})}
          aria-label={t('patients.careTeam.discardAssessment')}
          className='ml-auto'
          sx={{color: 'text.secondary'}}
        >
          <Icon icon='mdi:close' fontSize={18} />
        </IconButton>
      </Box>

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <RHFSelectField
          name={`assignments.${index}.checklistTemplateId` as const}
          control={control}
          disabled={isDisabled}
          label={t('patients.checklistTemplate')}
          options={checklistTemplateOptions}
        />

        <RHFAsyncAutocompleteField
          name={`assignments.${index}.caregiverId` as const}
          control={control}
          disabled={isDisabled}
          label={t('patients.caregiver')}
          placeholder={t('patients.caregiverSearchPlaceholder')}
          source={caregiverSource}
          onSelectOption={({option}) =>
            caregiverNameField.onChange(option?.label ?? '')
          }
          loadingText={t('common.loading')}
          noOptionsText={t('patients.noMatchingCaregivers')}
        />

        <Box className='sm:col-span-2'>
          <RHFSelectField
            name={`assignments.${index}.frequency` as const}
            control={control}
            disabled={isDisabled}
            label={t('patients.assignmentFrequency')}
            options={ASSIGNMENT_FREQUENCY_OPTIONS}
          />
        </Box>

        <RHFDateField
          name={`assignments.${index}.startDate` as const}
          control={control}
          disabled={isDisabled}
          label={t('patients.assignmentStartDate')}
          minDate={today}
          maxDate={startDateMax}
        />

        <RHFDateField
          name={`assignments.${index}.endDate` as const}
          control={control}
          disabled={isDisabled}
          label={t('patients.assignmentEndDate')}
          minDate={endDateMin}
        />

        <Box className='sm:col-span-2'>
          <RHFTextField
            name={`assignments.${index}.notes` as const}
            control={control}
            disabled={isDisabled}
            label={t('patients.assignmentNotes')}
            placeholder={t('patients.assignmentNotesPlaceholder')}
            multiline
            rows={2}
          />
        </Box>
      </Box>

      <Box className='flex justify-end'>
        <Button
          variant='contained'
          size='small'
          type='button'
          disabled={isDisabled}
          onClick={() => onCollapse({index})}
          startIcon={<Icon icon='mdi:check' fontSize={16} aria-hidden />}
        >
          {t('patients.careTeam.addToList')}
        </Button>
      </Box>
    </Box>
  );
};

export default NewAssignmentCard;
