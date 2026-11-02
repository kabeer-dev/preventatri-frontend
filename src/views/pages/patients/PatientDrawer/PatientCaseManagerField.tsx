'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientCaseManagerFieldProps} from '@/shared/interfaces/patient';
import {
  getStaffName,
  isPatientCaseManagerLocked,
} from '@/shared/utils/patientUtils';

const KEY = 'patients.careTeam';

// An HHAeXchange patient's case manager: read-only while HHAeXchange's one
// holds the patient, editable while the patient still waits for them.
const PatientCaseManagerField = ({
  control,
  caseManagerSource,
  isLoading,
  patient,
}: PatientCaseManagerFieldProps) => {
  const {t} = useTranslation();

  const isLocked = isPatientCaseManagerLocked({patient});
  const pendingName = getStaffName({staff: patient?.hhaPendingCaseManager});

  const hintKey =
    (pendingName && 'caseManagerWaitingHint') ||
    (isLocked && 'caseManagerHhaHint') ||
    'caseManagerPickedHint';

  return (
    <Box className='flex flex-col gap-4'>
      <SectionHeading title={t(`${KEY}.caseManager`)} />

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <RHFAsyncAutocompleteField
          name='caseManagerProfileId'
          control={control}
          label={t(`${KEY}.caseManager`)}
          placeholder={
            isLocked
              ? t(`${KEY}.noHhaCaseManager`)
              : t(`${KEY}.caseManagerPlaceholder`)
          }
          source={caseManagerSource}
          disabled={isLocked || isLoading}
          noOptionsText={t(`${KEY}.noEligibleCaseManagers`)}
        />
      </Box>

      <Typography variant='small' className='text-ink-soft'>
        {t(`${KEY}.${hintKey}`, {name: pendingName})}
      </Typography>
    </Box>
  );
};

export default PatientCaseManagerField;
