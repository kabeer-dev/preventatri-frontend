'use client';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import {Controller, FieldValues} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {RHFSegmentedFieldProps} from '@/shared/interfaces/followUp';

// A pill group bound to a form field (priority, outcome). Same shell as
// RegionStatusField, generic over the option values.
const RHFSegmentedField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
}: RHFSegmentedFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({field, fieldState: {error}}) => (
      <Box className='flex flex-col'>
        <FieldLabel>{label}</FieldLabel>
        <SegmentedTabs
          fullWidth
          disabled={disabled}
          ariaLabel={label}
          options={options}
          value={field.value}
          onChange={({value}) => field.onChange(value)}
        />
        {error && <FormHelperText error>{error.message}</FormHelperText>}
      </Box>
    )}
  />
);

export default RHFSegmentedField;
