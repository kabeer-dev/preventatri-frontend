'use client';

import Box from '@mui/material/Box';

import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFTimeField from '@/shared/components/common/inputs/RHFTimeField';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpDueFieldsProps} from '@/shared/interfaces/followUp';
import {getToday} from '@/shared/utils/dateUtils';

const FollowUpDueFields = ({
  control,
  disabled = false,
}: FollowUpDueFieldsProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  return (
    <Box className='grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3'>
      <RHFDateField
        name='dueDate'
        control={control}
        label={t('followUps.create.dueDate')}
        minDate={getToday({zone})}
        disabled={disabled}
      />
      <RHFTimeField
        name='dueTime'
        control={control}
        label={t('followUps.create.time')}
        disabled={disabled}
      />
    </Box>
  );
};

export default FollowUpDueFields;
