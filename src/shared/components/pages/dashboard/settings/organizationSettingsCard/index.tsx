'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import OrganizationSettingsSkeleton from '@/shared/components/common/skeletons/OrganizationSettingsSkeleton';
import {
  DAYS_ORDER,
  ORGANIZATION_SETTINGS_LAYOUT,
  TIME_ZONE_OPTIONS,
} from '@/shared/constants/settings';
import useNowTick from '@/shared/hooks/useNowTick';
import {useTimeZoneEditor} from '@/shared/hooks/useTimeZoneEditor';
import useTranslation from '@/shared/hooks/useTranslation';
import {useWorkingHoursEditor} from '@/shared/hooks/useWorkingHoursEditor';
import {getTodayDayKey} from '@/shared/utils/dateUtils';
import {getWorkingHoursStatusLabel} from '@/shared/utils/organizationUtils';
import {getWorkingHoursStatus} from '@/shared/utils/workingHours';

import SettingsSectionHeader from './SettingsSectionHeader';
import TimeField from './TimeField';
import TimeZoneOptionRow from './TimeZoneOptionRow';
import TimeZoneSelect from './TimeZoneSelect';

const OrganizationSettingsCard = () => {
  const {t} = useTranslation();

  const {
    isLoading,
    hours,
    isEditingHours,
    sameForAllDays,
    isPending,
    handleStartEditingHours,
    handleCancelEditingHours,
    handleToggleSameForAllDays,
    handleToggleDayEnabled,
    handleDayTimeChange,
    handleSharedTimeChange,
    handleSaveHours,
  } = useWorkingHoursEditor();

  const {
    isLoading: isTimeZoneLoading,
    selectedTimeZone,
    isEditingTimeZone,
    isPending: isTimeZonePending,
    setTimeZoneDraft,
    handleStartEditingTimeZone,
    handleCancelEditingTimeZone,
    handleSaveTimeZone,
  } = useTimeZoneEditor();

  const now = useNowTick();

  if (isLoading || isTimeZoneLoading || !hours)
    return <OrganizationSettingsSkeleton />;

  const selectedTimeZoneOption = TIME_ZONE_OPTIONS.find(
    (option) => option.key === selectedTimeZone
  );
  const organizationZoneValue = selectedTimeZoneOption?.value;

  const todayKey = getTodayDayKey({zone: organizationZoneValue});

  const status = getWorkingHoursStatus({
    workingHours: hours,
    zone: organizationZoneValue,
  });
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
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Card>
        <SettingsSectionHeader
          title={t('organizationSettings.timeZoneHeading')}
          subtitle={t('organizationSettings.timeZoneSubheading')}
          action={
            !isEditingTimeZone &&
            editButton({onClick: handleStartEditingTimeZone})
          }
        />

        <Box className='px-4.5 pb-4'>
          {isEditingTimeZone ? (
            <TimeZoneSelect
              value={selectedTimeZone ?? null}
              now={now}
              onChange={(key) => setTimeZoneDraft(key)}
            />
          ) : (
            selectedTimeZoneOption && (
              <TimeZoneOptionRow option={selectedTimeZoneOption} now={now} />
            )
          )}
        </Box>

        {isEditingTimeZone &&
          formActions({
            onCancel: handleCancelEditingTimeZone,
            onSave: handleSaveTimeZone,
            disabled: isTimeZonePending,
          })}
      </Card>

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
              {!isEditingHours &&
                editButton({onClick: handleStartEditingHours})}
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

        {DAYS_ORDER.map((day) => {
          const dayHours = hours[day];
          const isToday = day === todayKey;

          return (
            <Box
              key={day}
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
                      <Typography
                        variant='body2'
                        sx={{color: 'text.secondary'}}
                      >
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
        })}

        {isEditingHours &&
          formActions({
            onCancel: handleCancelEditingHours,
            onSave: handleSaveHours,
            disabled: isPending,
          })}
      </Card>
    </LocalizationProvider>
  );
};

export default OrganizationSettingsCard;
