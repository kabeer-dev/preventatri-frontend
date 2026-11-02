import {useId, useState} from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  useWatch,
} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';

interface RHFChipInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const RHFChipInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
}: RHFChipInputProps<T>) => {
  const fieldId = useId();
  const values = useWatch({name, control}) ?? [];
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <FormControl fullWidth>
          {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
          <Autocomplete
            id={fieldId}
            multiple
            freeSolo
            disabled={disabled}
            options={[]}
            value={(field.value as string[]) || []}
            onChange={(_event, newValue) => {
              if (duplicateError) {
                setDuplicateError(null);

                return;
              }

              field.onChange(newValue);
            }}
            onInputChange={(_event, inputValue) => {
              const input = inputValue.trim();

              const normalizedInput = input.toLowerCase();

              const alreadyExists = values.some((val: string) => {
                return val.trim().toLowerCase() === normalizedInput;
              });

              if (alreadyExists) {
                setDuplicateError('This value already exists');
              } else setDuplicateError(null);
            }}
            renderValue={(value, getItemProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  size='small'
                  {...getItemProps({index})}
                  key={index}
                  sx={{
                    backgroundColor: 'customColors.rule',
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '12.5px',
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  (field.value as string[])?.length > 0 ? '' : placeholder
                }
                error={Boolean(error) || !!duplicateError}
              />
            )}
            sx={{
              '& .MuiAutocomplete-inputRoot.MuiOutlinedInput-root': {
                flexWrap: 'wrap',
                gap: 0.5,
                minHeight: 100,
                alignItems: 'center',
                alignContent: 'flex-start',
              },
            }}
          />
          {(error || duplicateError) && (
            <FormHelperText sx={{color: 'error.main'}}>
              {duplicateError || error?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default RHFChipInput;
