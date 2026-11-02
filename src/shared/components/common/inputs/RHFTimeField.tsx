import {useId} from 'react';

import FormControl from '@mui/material/FormControl';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import {fromTimeString, toTimeString} from '@/shared/utils/dateUtils';

interface RHFTimeFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

// A wall-clock time field. The form value is the "HH:mm" string, so the zone
// is applied once, where the date and time are combined into an instant.
const RHFTimeField = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  size = 'medium',
}: RHFTimeFieldProps<T>) => {
  const labelId = useId();

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FormControl fullWidth>
        {label && <FieldLabel id={labelId}>{label}</FieldLabel>}
        <Controller
          name={name}
          control={control}
          render={({field: {value, onChange}, fieldState: {error}}) => (
            <TimePicker
              ampm={false}
              value={fromTimeString({value})}
              onChange={(next) => onChange(toTimeString({value: next}))}
              disabled={disabled}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  fullWidth: true,
                  size,
                  slotProps: {input: {'aria-labelledby': labelId}},
                },
              }}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export default RHFTimeField;
