'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {PATIENT_STATUS_OPTIONS} from '@/shared/constants/patients';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientLocationSectionProps} from '@/shared/interfaces/patient';

const PatientLocationSection = ({
  control,
  countySource,
  isHhaManaged,
  isCountyHhaManaged,
}: PatientLocationSectionProps) => {
  const {t} = useTranslation();

  const countyHint = isCountyHhaManaged
    ? t('patients.sync.countyManagedHint')
    : t('patients.sync.countyUnresolvedHint');

  return (
    <Box className='mb-6'>
      <Box className='mb-4'>
        <SectionHeading title={t('patients.locationAssignment')} />
      </Box>

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Box className='flex flex-col gap-1'>
          <RHFAsyncAutocompleteField
            name='county'
            control={control}
            disabled={isCountyHhaManaged}
            label={t('patients.county')}
            source={countySource}
          />

          {isHhaManaged && (
            <Typography variant='small' className='text-ink-soft'>
              {countyHint}
            </Typography>
          )}
        </Box>

        <RHFTextField
          name='assignedRegion'
          control={control}
          label={t('patients.assignedRegion')}
          disabled
        />

        <Box className='sm:col-span-2'>
          <RHFSelectField
            name='status'
            control={control}
            disabled={isHhaManaged}
            label={t('patients.status')}
            options={PATIENT_STATUS_OPTIONS}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientLocationSection;
