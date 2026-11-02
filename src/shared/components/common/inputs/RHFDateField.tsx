import {useId, useState} from 'react';

import FormControl from '@mui/material/FormControl';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {pickerDayClasses} from '@mui/x-date-pickers/PickerDay';
import {
  Controller,
  Path,
  Control,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import {CloseIcon} from '@/shared/components/icons';
import {DateTime, toDateTime} from '@/shared/utils/dateUtils';

interface RHFDateFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  clearable?: boolean;
  minDate?: DateTime;
  maxDate?: DateTime;
  disabled?: boolean;
  size?: 'small' | 'medium';

  rules?: RegisterOptions<T, Path<T>>;
}

const RHFDateField = <T extends FieldValues>({
  name,
  control,
  label,
  clearable = false,
  minDate,
  maxDate,
  disabled = false,
  size = 'medium',
  rules,
}: RHFDateFieldProps<T>) => {
  const labelId = useId();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => setIsPickerOpen(true);

  const closePicker = () => setIsPickerOpen(false);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FormControl
        fullWidth
        onClick={(e) => {
          const target = e.target as Element;
          if (target.closest?.(`.${pickerDayClasses.root}`)) closePicker();
          else openPicker();
        }}
      >
        {label && <FieldLabel id={labelId}>{label}</FieldLabel>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {value, onChange}, fieldState: {error}}) => (
            <DatePicker
              value={toDateTime({value})}
              onChange={onChange}
              open={isPickerOpen}
              onOpen={openPicker}
              onClose={closePicker}
              disabled={disabled}
              slots={{
                clearIcon: CloseIcon,
              }}
              slotProps={{
                field: {
                  clearable,
                  onClear: () => onChange(null),
                },
                clearButton: {
                  size: 'small',
                  className: 'h-7 w-7',
                },
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  fullWidth: true,
                  size,
                  slotProps: {input: {'aria-labelledby': labelId}},
                },
              }}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export default RHFDateField;
