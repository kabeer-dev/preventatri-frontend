'use client';

import Box from '@mui/material/Box';
import {FieldValues} from 'react-hook-form';

import RHFDateField from '@/shared/components/common/inputs/RHFDateField';
import RHFTimeField from '@/shared/components/common/inputs/RHFTimeField';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import {SupervisoryVisitScheduleFieldsProps} from '@/shared/interfaces/supervisoryVisit';
import {getToday} from '@/shared/utils/dateUtils';

// Date + start/end window (organization clock), generic over the form so the
// flag-resolve form can embed it under its own field names.
const SupervisoryVisitScheduleFields = <T extends FieldValues>({
  control,
  names,
  labels,
  disabled = false,
  size = 'medium',
}: SupervisoryVisitScheduleFieldsProps<T>) => {
  const {zone} = useOrganizationTimeZone();

  // Sized by its container, not the viewport: the same fields sit in a wide
  // drawer and in the narrow resolve rail, where one row clips the times.
  return (
    <Box className='@container'>
      <Box className='grid grid-cols-2 gap-3 @md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]'>
        <Box className='col-span-2 @md:col-span-1'>
          <RHFDateField
            name={names.date}
            control={control}
            label={labels.date}
            minDate={getToday({zone})}
            disabled={disabled}
            size={size}
          />
        </Box>
        <RHFTimeField
          name={names.startTime}
          control={control}
          label={labels.startTime}
          disabled={disabled}
          size={size}
        />
        <RHFTimeField
          name={names.endTime}
          control={control}
          label={labels.endTime}
          disabled={disabled}
          size={size}
        />
      </Box>
    </Box>
  );
};

export default SupervisoryVisitScheduleFields;
