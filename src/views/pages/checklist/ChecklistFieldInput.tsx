'use client';

import TextField from '@mui/material/TextField';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';
import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {ChecklistFieldInputProps} from '@/shared/interfaces/checklist';
import {DateTime, fromIso} from '@/shared/utils/dateUtils';

/** Widest the runner lets a number or a date field get. */
const RUNNER_FIELD_MAX_WIDTH = 320;

/**
 * The typed answer of a checklist question: a number, a date, or a few lines
 * of text. Every other type is a set of options and is rendered elsewhere.
 */
const ChecklistFieldInput = ({
  type,
  value,
  onChange,
  placeholder,
  size = 'small',
}: ChecklistFieldInputProps) => {
  const {t} = useTranslation();

  const isSmall = size === 'small';

  if (type === CHECKLIST_FIELD_TYPES.NUMBER) {
    return (
      <TextField
        fullWidth
        value={value}
        onChange={(event) => onChange({value: event.target.value})}
        placeholder={placeholder || t('checklist.enterNumber')}
        {...(isSmall
          ? {type: 'number', size: 'small'}
          : {
              // A decimal keypad on the phone, where a number field would
              // open the full keyboard.
              slotProps: {
                htmlInput: {inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*'},
              },
              sx: {
                maxWidth: RUNNER_FIELD_MAX_WIDTH,
                '& .MuiInputBase-input': {
                  fontSize: size === 'large' ? '2.25rem' : '1.75rem',
                  fontWeight: 600,
                },
              },
            })}
      />
    );
  }

  if (type === CHECKLIST_FIELD_TYPES.DATE) {
    return (
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          value={fromIso({value})}
          onChange={(newValue: DateTime | null) =>
            onChange({value: newValue ? (newValue.toISODate() ?? '') : ''})
          }
          slotProps={{
            textField: {
              fullWidth: true,
              ...(placeholder && {placeholder}),
              ...(isSmall
                ? {size: 'small'}
                : {sx: {maxWidth: RUNNER_FIELD_MAX_WIDTH}}),
            },
          }}
        />
      </LocalizationProvider>
    );
  }

  return (
    <TextField
      fullWidth
      multiline
      rows={size === 'large' ? 4 : 3}
      value={value}
      onChange={(event) => onChange({value: event.target.value})}
      placeholder={placeholder || t('checklist.enterResponse')}
      {...(isSmall
        ? {size: 'small'}
        : {sx: {maxWidth: CAREGIVER_RUNNER.questionMaxWidth}})}
    />
  );
};

export default ChecklistFieldInput;
