'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import {Controller, useWatch} from 'react-hook-form';

import RHFAutocompleteField from '@/shared/components/common/inputs/RHFAutocompleteField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS} from '@/shared/constants/flag';
import {useSupervisoryVisitCareTeamOptions} from '@/shared/hooks/useSupervisoryVisitCareTeamOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlsoCreateSectionProps} from '@/shared/interfaces/flag';
import SupervisoryVisitChecklistField from '@/views/pages/supervisoryVisits/SupervisoryVisitFormModal/SupervisoryVisitChecklistField';
import SupervisoryVisitScheduleFields from '@/views/pages/supervisoryVisits/SupervisoryVisitFormModal/SupervisoryVisitScheduleFields';

import FollowUpCreationFields from './FollowUpCreationFields';

// "Also create": the follow-up task and/or supervisory visit a resolution can
// schedule, each revealed by its checkbox.
const AlsoCreateSection = ({
  control,
  patientId,
  disabled = false,
}: AlsoCreateSectionProps) => {
  const {t} = useTranslation();

  const requireFollowUp = useWatch({control, name: 'requireFollowUp'});

  const requireSupervisoryVisit = useWatch({
    control,
    name: 'requireSupervisoryVisit',
  });

  const {assigneeOptions, isLoading: isCareTeamLoading} =
    useSupervisoryVisitCareTeamOptions({
      patientId,
      enabled: Boolean(requireSupervisoryVisit),
    });

  const renderToggle = ({
    name,
    label,
  }: {
    name: 'requireFollowUp' | 'requireSupervisoryVisit';
    label: string;
  }) => (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  );

  return (
    <Box>
      <Typography
        variant='small'
        component='span'
        sx={{
          display: 'block',
          mb: 1.75,
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        {t('flag.actionTaken.alsoCreate')}
      </Typography>

      {renderToggle({
        name: 'requireFollowUp',
        label: t('flag.actionTaken.requireFollowUp'),
      })}
      {requireFollowUp && (
        <FollowUpCreationFields
          control={control}
          patientId={patientId}
          disabled={disabled}
        />
      )}

      {renderToggle({
        name: 'requireSupervisoryVisit',
        label: t('flag.actionTaken.requireSupervisoryVisit'),
      })}
      {requireSupervisoryVisit && (
        <Box sx={{display: 'grid', gap: 2.5, pl: 7.5, pt: 1}}>
          <SupervisoryVisitScheduleFields
            control={control}
            names={{
              date: ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS.scheduledDate,
              startTime: ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS.startTime,
              endTime: ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS.endTime,
            }}
            labels={{
              date: t('flag.actionTaken.supervisoryVisitDateLabel'),
              startTime: t('flag.actionTaken.supervisoryVisitStartLabel'),
              endTime: t('flag.actionTaken.supervisoryVisitEndLabel'),
            }}
            disabled={disabled}
            size='small'
          />
          <Box>
            <RHFAutocompleteField
              name='supervisoryVisitAssigneeUserOrganizationId'
              control={control}
              label={t('flag.actionTaken.supervisoryVisitAssigneeLabel')}
              options={assigneeOptions}
              loading={isCareTeamLoading}
              loadingText={t('common.loading')}
              disabled={disabled}
            />
            <Typography variant='small' sx={{color: 'text.disabled'}}>
              {t('flag.actionTaken.supervisoryVisitAssigneeHelper')}
            </Typography>
          </Box>
          <SupervisoryVisitChecklistField
            control={control}
            name={ACTION_TAKEN_SUPERVISORY_VISIT_FIELDS.checklistTemplateId}
            disabled={disabled}
          />
          <RHFTextField
            name='visitInstructions'
            control={control}
            label={t('flag.actionTaken.visitInstructionsLabel')}
            placeholder={t('flag.actionTaken.visitInstructionsPlaceholder')}
            multiline
            rows={2}
            disabled={disabled}
          />
        </Box>
      )}
    </Box>
  );
};

export default AlsoCreateSection;
