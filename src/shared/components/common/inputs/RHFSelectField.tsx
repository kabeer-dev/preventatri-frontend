import {useState} from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, {SelectProps} from '@mui/material/Select';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import FieldPlaceholder from '@/shared/components/common/inputs/FieldPlaceholder';
import {CloseIcon} from '@/shared/components/icons';
import useTranslation from '@/shared/hooks/useTranslation';
import {isEmptySelection} from '@/shared/utils/inputs';

// MenuProps is omitted, the way RHFPasswordField omits slotProps, because this
// component owns the menu: it sizes the paper to the trigger and wraps long
// options. A caller's MenuProps could only be merged by spreading, and the slot
// values underneath it accept a callback form that spreading turns into {}.
interface RHFSelectFieldProps<T extends FieldValues> extends Omit<
  SelectProps<string | number>,
  'name' | 'MenuProps'
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: {label: string; value: string | number}[];
  clearable?: boolean;
}

const RHFSelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  clearable = false,
  ...other
}: RHFSelectFieldProps<T>) => {
  const {t} = useTranslation();

  const [anchorWidth, setAnchorWidth] = useState<number>();

  return (
    <FormControl
      fullWidth
      className='group'
      ref={(el: HTMLDivElement | null) => {
        if (el && el.clientWidth !== anchorWidth)
          setAnchorWidth(el.clientWidth);
      }}
    >
      {label && <FieldLabel id={`${name}-label`}>{label}</FieldLabel>}
      <Controller
        name={name}
        control={control}
        render={({field: {value, onChange}, fieldState: {error}}) => (
          <>
            <Select
              {...other}
              value={value}
              onChange={onChange}
              labelId={label ? `${name}-label` : undefined}
              error={Boolean(error)}
              displayEmpty
              renderValue={(selected: string | number) =>
                isEmptySelection({value: selected}) ? (
                  <FieldPlaceholder>
                    {t('inputs.selectPlaceholder')}
                  </FieldPlaceholder>
                ) : (
                  (options.find((option) => option.value === selected)?.label ??
                  '')
                )
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      width: anchorWidth,
                      '& .MuiMenuItem-root': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      },
                    },
                  },
                },
              }}
              input={
                <OutlinedInput
                  endAdornment={
                    clearable && value != null && value !== '' ? (
                      <InputAdornment position='end'>
                        <IconButton
                          size='small'
                          onClick={() => onChange('')}
                          sx={{mr: 6.5}}
                          onMouseDown={(e) => e.stopPropagation()}
                          className='h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined
                  }
                />
              }
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
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

export default RHFSelectField;
