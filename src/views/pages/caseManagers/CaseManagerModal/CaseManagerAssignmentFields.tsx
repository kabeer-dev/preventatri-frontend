'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import RHFAutocompleteField from '@/shared/components/common/inputs/RHFAutocompleteField';
import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseManagerAssignmentFieldsProps} from '@/shared/interfaces/caseManager';
import {getFullName} from '@/shared/utils/general';

const CaseManagerAssignmentFields = ({
  control,
  regionSource,
  patientOptions,
  hasRegionsSelected,
  statusOptions,
  hhaPatients,
  isHhaManaged = false,
}: CaseManagerAssignmentFieldsProps) => {
  const {t} = useTranslation();

  return (
    <Box className='grid grid-cols-1 gap-4'>
      <RHFAsyncAutocompleteField
        name='regionIds'
        control={control}
        label={t('caseManager.assignedRegions')}
        source={regionSource}
        multiple
      />

      {/* Linked by the HHAeXchange sync; regions never affect these. */}
      {hhaPatients.length > 0 && (
        <Box className='flex flex-col gap-2'>
          <FieldLabel>{t('caseManager.hhaPatients')}</FieldLabel>

          <Box className='flex flex-wrap gap-2'>
            {hhaPatients.map((patient) => (
              <CustomChip
                key={patient.id}
                size='small'
                color='info'
                skin='light'
                label={getFullName({
                  firstName: patient.firstName,
                  lastName: patient.lastName,
                })}
              />
            ))}
          </Box>

          <Typography variant='small' className='text-ink-soft'>
            {t('caseManager.hhaPatientsHint')}
          </Typography>
        </Box>
      )}

      <RHFAutocompleteField
        name='patientIds'
        control={control}
        label={t('caseManager.assignedPatients')}
        options={patientOptions}
        multiple
        disabled={!hasRegionsSelected}
        placeholder={
          hasRegionsSelected ? undefined : t('caseManager.assignedPatientsHint')
        }
      />

      <RHFSelectField
        name='status'
        control={control}
        label={t('caseManager.status')}
        disabled={isHhaManaged}
        options={[...statusOptions]}
      />
    </Box>
  );
};

export default CaseManagerAssignmentFields;
