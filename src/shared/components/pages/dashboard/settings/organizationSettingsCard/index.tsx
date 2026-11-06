'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import OrganizationSettingsSkeleton from '@/shared/components/common/skeletons/OrganizationSettingsSkeleton';
import {TIME_ZONE_OPTIONS} from '@/shared/constants/settings';
import useNowTick from '@/shared/hooks/useNowTick';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {useWorkingHoursEditor} from '@/shared/hooks/useWorkingHoursEditor';

import SettingsSectionHeader from './SettingsSectionHeader';
import TimeZoneOptionRow from './TimeZoneOptionRow';
import WorkingHoursCard from './WorkingHoursCard';

const OrganizationSettingsCard = () => {
  const {t} = useTranslation();

  const workingHoursEditor = useWorkingHoursEditor();

  // Set once when the organization registers and never edited here.
  const {zone: organizationZoneValue} = useOrganizationTimeZone();

  const now = useNowTick();

  const {isLoading, hours} = workingHoursEditor;

  if (isLoading || !hours) return <OrganizationSettingsSkeleton />;

  const selectedTimeZoneOption = TIME_ZONE_OPTIONS.find(
    (option) => option.value === organizationZoneValue
  );

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Card>
        <SettingsSectionHeader
          title={t('organizationSettings.timeZoneHeading')}
          subtitle={t('organizationSettings.timeZoneSubheading')}
        />

        <Box className='px-4.5 pb-4'>
          {selectedTimeZoneOption && (
            <TimeZoneOptionRow option={selectedTimeZoneOption} now={now} />
          )}
        </Box>
      </Card>

      <WorkingHoursCard
        editor={workingHoursEditor}
        hours={hours}
        zone={organizationZoneValue}
      />
    </LocalizationProvider>
  );
};

export default OrganizationSettingsCard;
