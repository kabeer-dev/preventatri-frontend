'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientNurseFieldsProps} from '@/shared/interfaces/patient';
import {
  getStaffName,
  isPatientPrimaryNurseLocked,
} from '@/shared/utils/patientUtils';

const PatientNurseFields = ({
  control,
  primaryNurseSource,
  secondaryNurseSource,
  isLoading,
  isHhaManaged,
  patient,
  countyName,
}: PatientNurseFieldsProps) => {
  const {t} = useTranslation();

  const isPrimaryNurseLocked = isPatientPrimaryNurseLocked({patient});

  // HHAeXchange's nurse is not active yet, so an admin may pick meanwhile.
  const pendingNurseName = getStaffName({staff: patient?.hhaPendingNurse});

  const hhaHintKey =
    (pendingNurseName && 'primaryNurseWaitingHint') ||
    (isPrimaryNurseLocked && 'primaryNurseHhaHint') ||
    'primaryNurseHhaUnassignedHint';

  return (
    <Box className='flex flex-col gap-4'>
      <SectionHeading title={t('patients.careTeam.nurses')} />

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <RHFAsyncAutocompleteField
          name='primaryNurseProfileId'
          control={control}
          label={t('patients.primaryNurse')}
          placeholder={
            isPrimaryNurseLocked
              ? t('patients.careTeam.noHhaPrimaryNurse')
              : t('patients.primaryNursePlaceholder')
          }
          source={primaryNurseSource}
          disabled={isPrimaryNurseLocked || isLoading}
          noOptionsText={t('patients.noEligibleNurses')}
        />

        <RHFAsyncAutocompleteField
          name='secondaryNurseProfileId'
          control={control}
          label={t('patients.secondaryNurse')}
          placeholder={t('patients.secondaryNursePlaceholder')}
          source={secondaryNurseSource}
          disabled={isLoading}
          noOptionsText={t('patients.noEligibleNurses')}
        />
      </Box>

      {isHhaManaged && (
        <Typography variant='small' className='text-ink-soft'>
          {t(`patients.careTeam.${hhaHintKey}`, {name: pendingNurseName})}
        </Typography>
      )}

      {countyName && (
        <Typography variant='small' className='text-ink-soft'>
          {t('patients.careTeam.nursesHint', {county: countyName})}
        </Typography>
      )}
    </Box>
  );
};

export default PatientNurseFields;
