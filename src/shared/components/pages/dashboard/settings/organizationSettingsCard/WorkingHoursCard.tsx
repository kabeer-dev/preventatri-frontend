'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import {DAYS_ORDER} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {WorkingHoursCardProps} from '@/shared/interfaces/settings';
import {getTodayDayKey} from '@/shared/utils/dateUtils';
import {getWorkingHoursStatusLabel} from '@/shared/utils/organizationUtils';
import {getWorkingHoursStatus} from '@/shared/utils/workingHours';

import SettingsSectionHeader from './SettingsSectionHeader';
import TimeField from './TimeField';
import WorkingHoursDayRow from './WorkingHoursDayRow';

const WorkingHoursCard = ({editor, hours, zone}: WorkingHoursCardProps) => {
  const {t} = useTranslation();

  const {
    isEditingHours,
    sameForAllDays,
    isPending,
    handleStartEditingHours,
    handleCancelEditingHours,
    handleToggleSameForAllDays,
    handleSharedTimeChange,
    handleSaveHours,
  } = editor;

  const todayKey = getTodayDayKey({zone});

  const status = getWorkingHoursStatus({workingHours: hours, zone});
  const statusLabel = getWorkingHoursStatusLabel({status, t});

  const editButton = ({onClick}: {onClick: () => void}) => (
    <Button
      variant='outlined'
      size='small'
      startIcon={<Icon icon='mdi:pencil-outline' fontSize={16} />}
      onClick={onClick}
      className='w-auto'
    >
      {t('organizationSettings.edit')}
    </Button>
  );

  const formActions = ({
    onCancel,
    onSave,
    disabled,
  }: {
    onCancel: () => void;
    onSave: () => void;
    disabled: boolean;
  }) => (
    <Box
      className='flex justify-end gap-2 px-4.5 py-3'
      sx={{borderTop: 1, borderColor: 'divider'}}
    >
      <Button
        variant='outlined'
        color='secondary'
        onClick={onCancel}
        disabled={disabled}
        className='w-auto'
      >
        {t('organizationSettings.discard')}
      </Button>
      <Button
        variant='contained'
        onClick={onSave}
        disabled={disabled}
        className='w-auto'
      >
        {t('organizationSettings.save')}
      </Button>
    </Box>
  );

  return (
    <Card>
      <SettingsSectionHeader
        title={t('organizationSettings.workingHoursHeading')}
        subtitle={t('organizationSettings.workingHoursSubheading')}
        action={
          <>
            <CustomChip
              size='small'
              color={status.kind === 'openNow' ? 'success' : 'secondary'}
              label={statusLabel}
            />
            {!isEditingHours && editButton({onClick: handleStartEditingHours})}
          </>
        }
      />

      {isEditingHours && (
        <Box className='flex flex-wrap items-center justify-between gap-2 px-4.5 pb-3'>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameForAllDays}
                onChange={handleToggleSameForAllDays}
              />
            }
            label={t('organizationSettings.sameForAllDays')}
          />

          {sameForAllDays && (
            <Box className='flex items-center gap-2'>
              <TimeField
                value={hours.monday.startTime}
                onChange={(value) =>
                  handleSharedTimeChange({field: 'startTime', value})
                }
              />
              <Typography variant='body2' sx={{color: 'text.secondary'}}>
                -
              </Typography>
              <TimeField
                value={hours.monday.endTime}
                onChange={(value) =>
                  handleSharedTimeChange({field: 'endTime', value})
                }
              />
            </Box>
          )}
        </Box>
      )}

      {DAYS_ORDER.map((day) => (
        <WorkingHoursDayRow
          key={day}
          day={day}
          dayHours={hours[day]}
          isToday={day === todayKey}
          editor={editor}
        />
      ))}

      {isEditingHours &&
        formActions({
          onCancel: handleCancelEditingHours,
          onSave: handleSaveHours,
          disabled: isPending,
        })}
    </Card>
  );
};

export default WorkingHoursCard;
