'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {
  PATIENT_DRAWER_FORM_IDS,
  PATIENT_GENDER_OPTIONS,
} from '@/shared/constants/patients';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientDetailsStepProps} from '@/shared/interfaces/patient';

import PatientLocationSection from './PatientLocationSection';

const PatientDetailsStep = ({
  onSubmit,
  control,
  countySource,
  isHhaManaged,
  isCountyHhaManaged,
}: PatientDetailsStepProps) => {
  const {t} = useTranslation();

  return (
    <form id={PATIENT_DRAWER_FORM_IDS.details} onSubmit={onSubmit}>
      {/* HHAeXchange-sourced patients: the fields that service owns are
          disabled below. The backend rejects them too, this only makes the
          restriction visible before the user starts typing. */}
      {isHhaManaged && (
        <Alert severity='info' className='mb-4'>
          {t('patients.sync.managedBanner')}
        </Alert>
      )}

      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('patients.personalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='firstName'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.firstNamePlaceholder')}
            label={t('patients.firstName')}
          />

          <RHFTextField
            name='lastName'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.lastNamePlaceholder')}
            label={t('patients.lastName')}
          />

          <RHFDateField
            name='dob'
            control={control}
            disabled={isHhaManaged}
            label={t('patients.dob')}
          />

          <RHFSelectField
            name='gender'
            control={control}
            disabled={isHhaManaged}
            label={t('patients.gender')}
            options={PATIENT_GENDER_OPTIONS}
          />
        </Box>
      </Box>

      <PatientLocationSection
        control={control}
        countySource={countySource}
        isHhaManaged={isHhaManaged}
        isCountyHhaManaged={isCountyHhaManaged}
      />

      <Box className='mb-6'>
        <Box className='mb-4'>
          <SectionHeading title={t('patients.addressInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Box className='sm:col-span-2'>
            <RHFTextField
              name='streetAddress'
              control={control}
              disabled={isHhaManaged}
              placeholder={t('patients.streetAddressPlaceholder')}
              label={t('patients.streetAddress')}
            />
          </Box>

          <RHFTextField
            name='city'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.cityPlaceholder')}
            label={t('patients.city')}
          />

          <RHFTextField
            name='zipCode'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.zipCodePlaceholder')}
            label={t('patients.zipCode')}
          />
        </Box>
      </Box>

      <Box>
        <Box className='mb-4'>
          <SectionHeading title={t('patients.additionalInfo')} />
        </Box>

        <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RHFTextField
            name='phoneNo'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.phoneNoPlaceholder')}
            label={t('patients.phoneNo')}
            type='phone'
          />

          <RHFTextField
            name='emergencyContact'
            control={control}
            disabled={isHhaManaged}
            placeholder={t('patients.emergencyContactPlaceholder')}
            label={t('patients.emergencyContact')}
            type='phone'
          />

          <Box className='sm:col-span-2'>
            <RHFTextField
              name='medicaidId'
              control={control}
              disabled={isHhaManaged}
              placeholder={t('patients.medicaidIdPlaceholder')}
              label={t('patients.medicaidId')}
            />
          </Box>
        </Box>

        <Box className='mt-4 grid grid-cols-1 gap-4'>
          <RHFTextField
            name='diagnoses'
            control={control}
            placeholder={t('patients.diagnosesPlaceholder')}
            label={t('patients.diagnoses')}
            multiline
            rows={3}
          />

          <RHFTextField
            name='notes'
            control={control}
            placeholder={t('patients.notesPlaceholder')}
            label={t('patients.notes')}
            multiline
            rows={3}
          />
        </Box>
      </Box>
    </form>
  );
};

export default PatientDetailsStep;
