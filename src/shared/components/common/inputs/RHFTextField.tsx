import {ReactNode} from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import {formatGeneral as cleaveFormat} from 'cleave-zen';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';

interface RHFTextFieldProps<T extends FieldValues> extends Omit<
  TextFieldProps,
  'name'
> {
  name: Path<T>;
  control: Control<T>;
  type?: 'phone' | TextFieldProps['type'];
  labelAction?: ReactNode;
}

const RHFTextField = <T extends FieldValues>({
  name,
  control,
  label,
  labelAction,
  ...other
}: RHFTextFieldProps<T>) => {
  const inputId = other.id ?? name;

  const isPhoneField = other.type === 'phone';
  const phonePrefix = '+1';
  const initialPhoneValue = `${phonePrefix} `;

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;

          if (isPhoneField) {
            e.target.value = cleaveFormat(value, {
              prefix: phonePrefix,
              blocks: [2, 3, 3, 4],
              delimiter: ' ',
              numericOnly: true,
            });
          }

          field.onChange(e);
        };

        const handleFocus = () => {
          if (isPhoneField && !field.value) field.onChange(initialPhoneValue);
        };

        const handleBlur = () => {
          if (isPhoneField && field.value === initialPhoneValue)
            field.onChange('');
        };

        return (
          <FormControl
            fullWidth
            className={labelAction ? 'relative' : undefined}
          >
            {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
            <TextField
              {...field}
              id={inputId}
              value={field.value ?? ''}
              error={Boolean(error)}
              onChange={handleInputChange}
              {...other}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {labelAction && (
              <Box className='absolute top-0 right-0 flex'>{labelAction}</Box>
            )}
            {error && (
              <FormHelperText sx={{color: 'error.main'}}>
                {error.message}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default RHFTextField;
