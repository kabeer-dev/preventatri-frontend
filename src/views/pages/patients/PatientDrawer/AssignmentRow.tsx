'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssignmentRowProps} from '@/shared/interfaces/patient';
import {
  formatAssignmentDate,
  formatAssignmentFrequency,
} from '@/shared/utils/patientUtils';
import {cn} from '@/shared/utils/tailwindUtils';

const AssignmentRow = ({
  title,
  caregiverName,
  frequency,
  startDate,
  endDate,
  isNew = false,
  isRemoved = false,
  isDisabled,
  isSaving = false,
  onEdit,
  onRemove,
  onUndo,
}: AssignmentRowProps) => {
  const {t} = useTranslation();

  const frequencyLabel = formatAssignmentFrequency({frequency});

  return (
    <Box
      className={cn(
        'border-border flex items-center gap-3 rounded-lg border px-4 py-3',
        isRemoved ? 'bg-surface border-dashed' : 'bg-surface-raised'
      )}
    >
      <Box className='flex min-w-0 flex-auto flex-col gap-1'>
        <Typography
          variant='bodyStrong'
          className={cn(isRemoved && 'text-ink-subtle line-through')}
        >
          {title}
        </Typography>

        <Box className='flex flex-wrap items-center gap-x-3 gap-y-1'>
          {isNew && <CustomChip label={t('patients.careTeam.newTag')} />}
          {isRemoved && (
            <CustomChip
              color='error'
              label={t('patients.careTeam.removedOnSave')}
            />
          )}
          <Typography variant='small' className='text-ink-muted'>
            {caregiverName}
          </Typography>
          {frequencyLabel && <CustomChip label={frequencyLabel} />}
          <Typography variant='mono' className='text-ink-soft'>
            {t('patients.careTeam.dateRange', {
              startDate: formatAssignmentDate({value: startDate}),
              endDate: formatAssignmentDate({value: endDate}),
            })}
          </Typography>
        </Box>
      </Box>

      <Box className='flex shrink-0 items-center gap-1'>
        {isRemoved ? (
          <Button
            variant='outlined'
            color='secondary'
            size='small'
            type='button'
            disabled={isSaving}
            onClick={onUndo}
          >
            {t('patients.careTeam.undo')}
          </Button>
        ) : (
          <>
            {onEdit && (
              <IconButton
                size='small'
                type='button'
                disabled={isDisabled}
                onClick={onEdit}
                aria-label={t('patients.careTeam.editAssessment')}
                sx={{color: 'text.secondary'}}
              >
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </IconButton>
            )}
            <IconButton
              size='small'
              type='button'
              color='error'
              disabled={isDisabled}
              onClick={onRemove}
              aria-label={
                isNew
                  ? t('patients.careTeam.discardAssessment')
                  : t('patients.careTeam.removeAssessment')
              }
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AssignmentRow;
