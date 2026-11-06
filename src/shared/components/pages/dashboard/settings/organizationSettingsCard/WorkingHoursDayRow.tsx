'use client';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {ORGANIZATION_SETTINGS_LAYOUT} from '@/shared/constants/settings';
import useTranslation from '@/shared/hooks/useTranslation';
import {WorkingHoursDayRowProps} from '@/shared/interfaces/settings';

import TimeField from './TimeField';

const WorkingHoursDayRow = ({
  day,
  dayHours,
  isToday,
  editor,
}: WorkingHoursDayRowProps) => {
  const {t} = useTranslation();

  const {
    isEditingHours,
    sameForAllDays,
    handleToggleDayEnabled,
    handleDayTimeChange,
  } = editor;

  return (
    <Box
      className='flex flex-wrap items-center gap-x-3 gap-y-2 px-4.5 py-2'
      sx={{
        minHeight: ORGANIZATION_SETTINGS_LAYOUT.dayRowHeight,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: isToday ? 'customColors.brandTint' : 'transparent',
      }}
    >
      <Box className='flex shrink-0 items-center gap-3'>
        <Switch
          checked={dayHours.enabled}
          disabled={!isEditingHours}
          onChange={() => handleToggleDayEnabled({day})}
        />
        <Typography
          variant='body'
          sx={{
            fontWeight: 600,
            minWidth: 72,
            color: isToday ? 'primary.main' : 'text.primary',
          }}
        >
          {t(`organizationSettings.days.${day}`)}
        </Typography>
        {isToday && (
          <CustomChip
            size='small'
            color='primary'
            label={t('organizationSettings.today')}
          />
        )}
      </Box>

      <Box className='flex min-w-0 grow justify-end'>
        {!dayHours.enabled ? (
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t('organizationSettings.closed')}
          </Typography>
        ) : (
          !sameForAllDays && (
            <Box className='flex flex-wrap items-center gap-2'>
              <TimeField
                value={dayHours.startTime}
                disabled={!isEditingHours}
                onChange={(value) =>
                  handleDayTimeChange({day, field: 'startTime', value})
                }
              />
              <Typography variant='body2' sx={{color: 'text.secondary'}}>
                -
              </Typography>
              <TimeField
                value={dayHours.endTime}
                disabled={!isEditingHours}
                onChange={(value) =>
                  handleDayTimeChange({day, field: 'endTime', value})
                }
              />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default WorkingHoursDayRow;
