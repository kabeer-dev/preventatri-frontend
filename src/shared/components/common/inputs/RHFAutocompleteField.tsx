import {useId} from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grow from '@mui/material/Grow';
import Paper, {PaperProps} from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';

interface Option {
  label: string;
  value: string;
}

interface RHFAutocompleteFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  noOptionsText?: React.ReactNode;
  loading?: boolean;
  loadingText?: React.ReactNode;
}

const DropdownPaper = (props: PaperProps) => (
  <Grow in>
    <Paper elevation={8} {...props} />
  </Grow>
);

const RHFAutocompleteField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  multiple = false,
  disabled = false,
  noOptionsText,
  loading = false,
  loadingText,
}: RHFAutocompleteFieldProps<T>) => {
  const resolveValue = ({val}: {val: string | string[] | undefined}) =>
    multiple
      ? options.filter((o) => (val as string[])?.includes(o.value))
      : (options.find((o) => o.value === val) ?? null);

  const resolveOnChange = ({newValue}: {newValue: Option | Option[] | null}) =>
    multiple
      ? ((newValue as Option[])?.map((o) => o.value) ?? [])
      : ((newValue as Option | null)?.value ?? '');

  const fieldId = useId();

  return (
    <FormControl fullWidth>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <Controller
        name={name}
        control={control}
        render={({field: {value, onChange}, fieldState: {error}}) => (
          <>
            <Autocomplete
              id={fieldId}
              multiple={multiple as any}
              disabled={disabled}
              disableCloseOnSelect={multiple}
              options={options}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? options.find((o) => o.value === option)?.label || option
                  : option.label
              }
              value={resolveValue({val: value})}
              onChange={(_event, newValue) =>
                onChange(resolveOnChange({newValue}))
              }
              isOptionEqualToValue={(option, val) =>
                option.value === (typeof val === 'string' ? val : val.value)
              }
              slots={{paper: DropdownPaper}}
              slotProps={{listbox: {style: {maxHeight: 200}}}}

              // MUI keys options by label; two people with the same name
              // (or two "Other" entries) would collide.
              renderOption={(optionProps, option) => {
                const {key: _labelKey, ...liProps} = optionProps;

                return (
                  <li key={option.value} {...liProps}>
                    {option.label}
                  </li>
                );
              }}
              loading={loading}
              loadingText={loadingText}
              noOptionsText={noOptionsText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeholder}
                  error={Boolean(error)}
                />
              )}
            />
            {error && (
              <FormHelperText sx={{color: 'error.main'}}>
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

export default RHFAutocompleteField;
